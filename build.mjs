import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';

const output = 'dist';
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
const files = await readdir('.', { withFileTypes: true });
const excluded = new Set([
  '.env.example',
  '.git',
  '.gitignore',
  '.openai',
  '.vercel',
  'api',
  'build.mjs',
  'dist',
  'n8n',
  'node_modules',
  'package.json',
  'README.md',
  'supabase-setup.sql',
  'tools',
  'vercel.json',
  'worker.js',
  'worker.test.mjs',
]);
for (const file of files) {
  if (excluded.has(file.name)) continue;
  await cp(file.name, `${output}/${file.name}`, { recursive: true });
}
await mkdir(`${output}/server`, { recursive: true });
await writeFile(`${output}/server/index.js`, await readFile('worker.js', 'utf8'));
