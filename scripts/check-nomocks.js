const { execSync } = require('child_process');

const targets = ['data', 'services', 'components', 'views', 'utils', 'App.tsx'];
let output = '';

for (const t of targets) {
  try {
    output += execSync(`rg -n --ignore-case mock ${t}`, { encoding: 'utf8' });
  } catch (err) {
    if (err.stdout) {
      output += err.stdout;
    }
  }
}

if (output.trim()) {
  console.warn('Mock references found (warning only):');
  console.warn(output);
} else {
  console.log('No mock references found.');
}
