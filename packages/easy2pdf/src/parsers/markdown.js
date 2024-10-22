const markdown = require('markdown-it');
const buildHTML = require('./html.js');

const md = markdown({ html: true, linkify: true });

/**
 * Wraps Markdown content into properly HTML structure
 * @param {string} title
 * @param {string} content
 * @returns Properly structured HTML file-ready content
 */
const buildMarkdown = (title, content) => buildHTML(title, md.render(content));

module.exports = buildMarkdown;
