const fs = require('fs');
const file = 'scripts/build-resource-registry.mjs';
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(
  /if \(idMap\.has\(res\.shortId\)\) \{[\s\S]*?continue;\n\s*\}/,
  `if (idMap.has(res.shortId)) {
        // Skip duplicate IDs quietly to allow multiple instances in MDX
        // without polluting the resource registry.
        continue;
      }`
);

fs.writeFileSync(file, content);
