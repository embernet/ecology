const fs = require('fs');
const file = 'components/ResourceIndexClient.tsx';
let content = fs.readFileSync(file, 'utf-8');

const oldLogic = `    return resource.data.wikiImages.map(img => {
      const cleanFilename = img.filename.trim().split(' ').join('_');
      return \\\`https://commons.wikimedia.org/wiki/Special:FilePath/\${encodeURIComponent(cleanFilename)}?width=400\\\`;
    });`;

const newLogic = `    return resource.data.wikiImages.map(img => {
      if (img.isStandardImg) return img.filename;
      const cleanFilename = img.filename.trim().split(' ').join('_');
      return \`https://commons.wikimedia.org/wiki/Special:FilePath/\${encodeURIComponent(cleanFilename)}?width=400\`;
    });`;

content = content.replace(oldLogic, newLogic);
fs.writeFileSync(file, content);
