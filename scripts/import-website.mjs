import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || '../riloc-nextjs');
const pages = [
  ['index', 'home', '/', 'Home'],
  ['about', 'about', '/about', 'About'],
  ['portfolio', 'portfolio', '/portfolio', 'Portfolio'],
  ['contact', 'contact', '/contact', 'Contact'],
].map(([file, slug, route, name]) => {
  const source = fs.readFileSync(path.join(root, 'lib', `${file}.ts`), 'utf8');
  const start = source.indexOf(`export const ${file}Page = `) + `export const ${file}Page = `.length;
  const end = source.indexOf(';\nexport const', start);
  if (start < 0 || end < 0) throw new Error(`Could not parse ${file}.ts`);
  const markup = JSON.parse(source.slice(start, end));
  const metadata = source.slice(end).match(/export const \w+Metadata = \{\s*title: ("(?:[^"\\]|\\.)*")(?:, description: ("(?:[^"\\]|\\.)*"))?/);
  if (!metadata) throw new Error(`Could not read metadata from ${file}.ts`);
  return {
    id: slug,
    route,
    name,
    title: JSON.parse(metadata[1]),
    description: metadata[2] ? JSON.parse(metadata[2]) : '',
    markup,
    is_published: true,
  };
});

fs.mkdirSync('data', { recursive: true });
fs.writeFileSync('data/initial-content.json', `${JSON.stringify(pages, null, 2)}\n`);
console.log(`Imported ${pages.length} pages from ${root} into data/initial-content.json`);
