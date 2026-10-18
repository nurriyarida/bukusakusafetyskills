import fs from 'fs';

const code = fs.readFileSync('/tmp/site.js', 'utf8');

// Find all occurrences of keys / section names
console.log("Analyzing site.js...");

// Find export default or main App component
// Let's find react root render
const rootIdx = code.indexOf('.render(');
console.log("Root render around:", rootIdx);
if (rootIdx !== -1) {
  console.log(code.substring(rootIdx - 200, rootIdx + 100));
}
