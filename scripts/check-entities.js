const fs = require('fs');
const path = require('path');

const typesPath = path.join(__dirname, '..', 'types', 'index.ts');
const typesContent = fs.readFileSync(typesPath, 'utf8');
const entityMatch = typesContent.match(/export type Entity = ([^;]+)/);
const unionEntities = entityMatch ? entityMatch[1].split('|').map(s => s.trim()) : [];
const appMatch = typesContent.match(/export interface AppData {([\s\S]*?)^}/m);
const appBody = appMatch ? appMatch[1] : '';
const appEntities = Array.from(appBody.matchAll(/:\s*([A-Za-z0-9_]+)/g)).map(m => m[1]);
const entities = Array.from(new Set([...unionEntities, ...appEntities])).filter(n => n && !['AppData','Entity','Added'].includes(n));
const srcDir = path.join(__dirname, '..', 'packages', 'shared', 'src');
const srcFiles = fs.readdirSync(srcDir).filter(f => f.endsWith('.ts'));
const indexContent = srcFiles.map(f => fs.readFileSync(path.join(srcDir, f), 'utf8')).join('\n');
const results = entities.map(name => {
  const schemaName = `${name}Schema`;
  const found = indexContent.includes(schemaName);
  return { entity: name, hasSchema: found };
});
const tableLines = ['| Entity | Schema |', '|---|---|', ...results.map(r => `| ${r.entity} | ${r.hasSchema ? '✔️' : '❌'} |`)];
const docsPath = path.join(__dirname, '..', 'docs', 'entity_parity_matrix.md');
fs.writeFileSync(docsPath, tableLines.join('\n') + '\n');
console.log(tableLines.join('\n'));
if (results.some(r => !r.hasSchema)) {
  process.exitCode = 1;
}
