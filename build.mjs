import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';

const output = 'dist';
await mkdir(output, { recursive: true });
const files = await readdir('.', { withFileTypes: true });
for (const file of files) {
  if (file.name === 'dist' || file.name === '.git' || file.name === 'node_modules') continue;
  await cp(file.name, `${output}/${file.name}`, { recursive: true });
}
await mkdir(`${output}/server`, { recursive: true });
await writeFile(`${output}/server/index.js`, "export default { async fetch(request, env) { return env.ASSETS.fetch(request); } };\n");
