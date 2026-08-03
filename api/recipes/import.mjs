const FAMILY_STATE_KEY = 'atable-recipes-v2';

function cleanText(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function cleanLines(value, maxItems = 100) {
  const lines = Array.isArray(value) ? value : typeof value === 'string' ? value.split(/\r?\n/) : [];
  return lines.map((line) => cleanText(line, 500)).filter(Boolean).slice(0, maxItems);
}

function positiveNumber(value, fallback, maximum) {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? Math.min(number, maximum) : fallback;
}

function safeUrl(value) {
  const text = cleanText(value, 2_000);
  if (!text) return '';
  try {
    const url = new URL(text);
    return ['http:', 'https:'].includes(url.protocol) ? url.toString() : '';
  } catch {
    return '';
  }
}

function normalizeRecipe(input) {
  const name = cleanText(input?.name ?? input?.title, 160);
  if (!name) throw new Error('Le nom de la recette est obligatoire.');
  const sourceUrl = safeUrl(input?.sourceUrl ?? input?.url);
  const requestedTag = cleanText(input?.category ?? input?.tag, 30).toLowerCase();
  return {
    id: `import-${crypto.randomUUID()}`,
    externalId: cleanText(input?.externalId ?? input?.id, 160),
    name,
    tag: ['xxl', 'gamelle', 'rapide', 'dessert'].includes(requestedTag) ? requestedTag : 'rapide',
    image: safeUrl(input?.imageUrl ?? input?.image) || 'assets/pates-gratin.png',
    price: positiveNumber(input?.price ?? input?.estimatedPrice, 0, 1_000),
    time: positiveNumber(input?.time ?? input?.totalTime, 30, 1_440),
    portions: Math.max(1, Math.round(positiveNumber(input?.portions ?? input?.servings, 4, 100))),
    note: cleanText(input?.note, 300) || 'Recette importée automatiquement',
    ingredients: cleanLines(input?.ingredients).join('\n'),
    steps: cleanLines(input?.steps ?? input?.instructions),
    sourceUrl,
    importedAt: new Date().toISOString(),
    custom: true,
  };
}

function sameRecipe(existing, incoming) {
  if (incoming.externalId && existing.externalId === incoming.externalId) return true;
  if (incoming.sourceUrl && existing.sourceUrl === incoming.sourceUrl) return true;
  return existing.name?.trim().toLocaleLowerCase('fr') === incoming.name.toLocaleLowerCase('fr');
}

export default async function handler(request, response) {
  response.setHeader('Cache-Control', 'no-store');
  if (request.method !== 'POST') return response.status(405).json({ ok: false, error: 'Méthode non autorisée.' });
  if (!process.env.ATABLE_IMPORT_TOKEN || request.headers.authorization !== `Bearer ${process.env.ATABLE_IMPORT_TOKEN}`) {
    return response.status(401).json({ ok: false, error: 'Non autorisé.' });
  }

  let incoming;
  try {
    incoming = normalizeRecipe(typeof request.body === 'string' ? JSON.parse(request.body) : request.body);
  } catch (error) {
    return response.status(422).json({ ok: false, error: error.message });
  }

  const { SUPABASE_URL, SUPABASE_ANON_KEY, ATABLE_FAMILY_ID } = process.env;
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !ATABLE_FAMILY_ID) {
    return response.status(503).json({ ok: false, error: 'Configuration serveur incomplète.' });
  }

  const headers = { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' };
  const endpoint = `${SUPABASE_URL}/rest/v1/family_state?id=eq.${encodeURIComponent(ATABLE_FAMILY_ID)}&select=data`;
  const currentResponse = await fetch(endpoint, { headers });
  if (!currentResponse.ok) return response.status(502).json({ ok: false, error: 'Lecture de la base impossible.' });

  const rows = await currentResponse.json();
  const data = rows[0]?.data && typeof rows[0].data === 'object' ? rows[0].data : {};
  let recipes = [];
  try {
    const stored = JSON.parse(data[FAMILY_STATE_KEY] || '[]');
    if (Array.isArray(stored)) recipes = stored.filter((recipe) => !/^r\d+-\d+$/.test(recipe?.id || '') && !/^plaisir-\d+$/.test(recipe?.id || ''));
  } catch {
    recipes = [];
  }

  const duplicate = recipes.find((recipe) => sameRecipe(recipe, incoming));
  if (duplicate) return response.status(200).json({ ok: true, created: false, duplicate: true, recipe: { id: duplicate.id, name: duplicate.name } });

  recipes.push(incoming);
  const saveResponse = await fetch(`${SUPABASE_URL}/rest/v1/family_state?on_conflict=id`, {
    method: 'POST',
    headers: { ...headers, Prefer: 'resolution=merge-duplicates,return=minimal' },
    body: JSON.stringify({ id: ATABLE_FAMILY_ID, data: { ...data, [FAMILY_STATE_KEY]: JSON.stringify(recipes) }, updated_at: new Date().toISOString() }),
  });
  if (!saveResponse.ok) return response.status(502).json({ ok: false, error: 'Enregistrement impossible.' });
  return response.status(201).json({ ok: true, created: true, duplicate: false, recipe: { id: incoming.id, name: incoming.name } });
}
