const fs = require('fs');
const path = require('path');

const entities = ['Product','Country','Platform','Envase','Video'];
const sharedIndexPath = path.join(__dirname, '..', 'packages', 'shared', 'src', 'index.ts');
const indexContent = fs.readFileSync(sharedIndexPath, 'utf8');
const results = entities.map(name => {
  const schemaName = `${name}Schema`;
  const found = indexContent.includes(schemaName);
  return { entity: name, hasSchema: found };
});
const tableLines = ['| Entity | Schema |', '|---|---|', ...results.map(r => `| ${r.entity} | ${r.hasSchema ? '✔️' : '❌'} |`)];
const docsPath = path.join(__dirname, '..', 'docs', 'entity_parity_matrix.md');
fs.writeFileSync(docsPath, tableLines.join('\n'));
console.log(tableLines.join('\n'));
if (results.some(r => !r.hasSchema)) {
  process.exitCode = 1;
}
