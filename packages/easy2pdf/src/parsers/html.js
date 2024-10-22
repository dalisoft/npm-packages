/**
 * Wraps HTML content into properly HTML structure
 * @param {string} title
 * @param {string} content
 * @returns Properly structured HTML file-ready content
 */
const buildHTML = (title, content) => `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/github-markdown-css/5.7.0/github-markdown.min.css"
    integrity="sha512-RXrQNShK831yZVcMWsLosdpsHddeG5xP7zMmlDu/OLQdfx24Z9pO1KiFZ1eZrMqY8P9hYgknwU/O6GxR2Fc0Gw=="
    crossorigin="anonymous" referrerpolicy="no-referrer" />
  <style>
    @page {
      size: A4 portrait;
      margin: 20mm;
    }

    html,
    body {
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, system-ui, Avenir, Helvetica;
    }

    @media print {
      body {
        width: 210mm;
        height: 297mm;
      }
    }

    .markdown-body {
      padding: 32px;
    }
  </style>
</head>

<body class="markdown-body">
${content}
</body>
</html>`;

module.exports = buildHTML;
