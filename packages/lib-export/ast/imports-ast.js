import {
  lineBreakRegExp,
  moduleImportRegExp,
  requireRegExp
} from './regexp.js';

export default (fileData) => {
  const lines = fileData.split(lineBreakRegExp);
  return lines
    .filter((line) => line)
    .map((line) => {
      let moduleMatch = moduleImportRegExp.exec(line);
      const requireMatch = requireRegExp.exec(line);

      if (!moduleMatch) {
        // I don't know why? But it sometimes catchs
        // At second try
        // but first try not catched
        moduleMatch = moduleImportRegExp.exec(line);
      }

      if (moduleMatch) {
        if (moduleMatch[2].indexOf('{') === 0) {
          let exportsList = moduleMatch[2].substr(2);
          exportsList = exportsList.substr(0, exportsList.length - 2);
          exportsList = exportsList.split(',').map((v) => v.trim());

          return {
            default: false,
            module: true,
            namedExports: exportsList,
            path: moduleMatch[3]
          };
        }
        return {
          constant: moduleMatch[2],
          default: true,
          module: true,
          path: moduleMatch[3]
        };
      } else if (requireMatch) {
        return {
          constant: requireMatch[2],
          module: false,
          path: requireMatch[3]
        };
      }
    })
    .filter((imports) => imports);
};
