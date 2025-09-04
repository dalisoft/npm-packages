const markdown = require('markdown-it');
const hljs = require('highlight.js');
const buildHTML = require('./html.js');

const md = markdown({
  html: true,
  linkify: true,
  highlight(str, lang) {
    if (!lang) {
      return '';
    }
    if (hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${
          hljs.highlight(str, { language: lang, ignoreIllegals: true }).value
        }</code></pre>`;
      } catch (__) {
        // noop
      }
    }
    if (lang.toLowerCase() === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    }

    return '';
  }
});

/**
 * Wraps Markdown content into properly HTML structure
 * @param {string} title
 * @param {string} content
 * @returns Properly structured HTML file-ready content
 */
const buildMarkdown = (title, content) => buildHTML(title, md.render(content));

module.exports = buildMarkdown;
