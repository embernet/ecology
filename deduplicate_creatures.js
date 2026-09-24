const fs = require('fs');
const path = require('path');

const duplicates = [
  { primary: "n45", others: ["n53"] },
  { primary: "n42", others: ["n54", "n87"] },
  { primary: "n35", others: ["n99", "n300"] },
  { primary: "n44", others: ["n51", "n145"] },
  { primary: "n218", others: ["n355"] },
  { primary: "n95", others: ["n142", "n370"] },
  { primary: "n50", others: ["n100"] },
  { primary: "n316", others: ["n321"] },
  { primary: "n48", others: ["n180"] },
  { primary: "n320", others: ["n327"] },
  { primary: "n52", others: ["n182"] }
];

function getFiles(dir, files = []) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getFiles(fullPath, files);
    } else if (fullPath.endsWith('.md')) {
      files.push(fullPath);
    }
  });
  return files;
}

const files = getFiles('content');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf-8');
  let changed = false;
  
  for (const group of duplicates) {
    for (const otherId of group.others) {
      const regex = new RegExp(`id={\`${otherId}\`}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `id={\`${group.primary}\`}`);
        changed = true;
      }
      const regex2 = new RegExp(`id="${otherId}"`, 'g');
      if (regex2.test(content)) {
        content = content.replace(regex2, `id="${group.primary}"`);
        changed = true;
      }
      
      // Also update the image URLs if any
      const imgRegex = new RegExp(`${otherId}-`, 'g');
      if (imgRegex.test(content)) {
        content = content.replace(imgRegex, `${group.primary}-`);
        changed = true;
      }
    }
  }
  
  if (changed) {
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
}
