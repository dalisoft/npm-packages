const fs = require('node:fs/promises');
const path = require('node:path');
const buildHTML = require('./parsers/html.js');
const buildMarkdown = require('./parsers/markdown.js');
const buildPDFBuffer = require('./pdf.js');

/**
 * PDF build API interface
 * @param {FileName} target
 */
async function buildPDF(target) {
  const absolutePath = path.resolve(target);
  const ext = path.extname(target);

  if (await fs.stat(absolutePath).catch(() => false)) {
    const content = await fs.readFile(absolutePath, { encoding: 'utf-8' });

    switch (ext) {
      case '.html': {
        const html = await buildHTML(target, content);
        const pdf_buffer = await buildPDFBuffer(html);

        await fs.writeFile(`${absolutePath}.pdf`, pdf_buffer);

        return true;
      }
      case '.md': {
        const html = await buildMarkdown(target, content);
        const pdf_buffer = await buildPDFBuffer(html);

        await fs.writeFile(`${absolutePath}.pdf`, pdf_buffer);

        return true;
      }
      default: {
        break;
      }
    }

    return false;
  }

  console.error(`easy2pdf: Such file ("${target}") a does not exist`);
  return false;
}

module.exports = buildPDF;
