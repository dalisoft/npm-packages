import hljs from 'highlight.js';
import markdown from 'markdown-it';
import buildHTML from './html.js';

const md = markdown({
  highlight(str, lang) {
    if (!lang) {
      return '';
    }
    if (hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${
          hljs.highlight(str, { ignoreIllegals: true, language: lang }).value
        }</code></pre>`;
      } catch (__) {
        // noop
      }
    }
    if (lang.toLowerCase() === 'mermaid') {
      return `<pre class="mermaid">${str}</pre>`;
    }

    return '';
  },
  html: true,
  linkify: true
});

/**
 * Wraps Markdown content into properly HTML structure
 * @param {string} title
 * @param {string} content
 * @returns Properly structured HTML file-ready content
 */
const buildMarkdown = (title, content) => buildHTML(title, md.render(content));

export default buildMarkdown;
