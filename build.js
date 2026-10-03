// Shared `bun build` helper for packages publishing ES/CJS/UMD bundles
// Usage: bun ../../build.js <entry> --name=<UmdName> [--es=<file>] [--cjs=<file>] [--umd=<file>] [--min=<file>]
//          [--clean=<dir>] [--named] [--bundle] [--sourcemap] [--watch=<dir>]
import { rmSync, watch } from 'node:fs';
import { basename, dirname } from 'node:path';
import { parseArgs } from 'node:util';

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    name: { type: 'string' },
    es: { type: 'string' },
    cjs: { type: 'string' },
    umd: { type: 'string' },
    min: { type: 'string' },
    clean: { type: 'string' },
    named: { type: 'boolean' },
    bundle: { type: 'boolean' },
    sourcemap: { type: 'boolean' },
    watch: { type: 'string' }
  }
});
const [entry] = positionals;
// Same as rollup `output.exports: 'auto'` for default-only modules
const exportsValue = values.named
  ? 'module.exports'
  : '(module.exports.default || module.exports)';

const umdBanner = `(function (root, factory) {
  if (typeof define === 'function' && define.amd) define(['require'], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory(require);
  else root.${values.name} = factory(function (id) { return root[id]; });
})(typeof self !== 'undefined' ? self : this, function (require) {
var module = { exports: {} };`;
const umdFooter = `return ${exportsValue};
});`;

const bundle = async (outfile, format, options = {}) => {
  const result = await Bun.build({
    entrypoints: [entry],
    outdir: dirname(outfile),
    naming: basename(outfile),
    format,
    target: 'node',
    packages: values.bundle ? 'bundle' : 'external',
    sourcemap: values.sourcemap ? 'linked' : 'none',
    ...options
  });
  if (!result.success) {
    throw new AggregateError(result.logs, `Build failed: ${outfile}`);
  }
};

const build = async () => {
  if (values.clean) rmSync(values.clean, { recursive: true, force: true });
  if (values.es) await bundle(values.es, 'esm');
  if (values.cjs) {
    await bundle(values.cjs, 'cjs', {
      footer: values.named ? '' : `module.exports = ${exportsValue};`
    });
  }
  for (const [outfile, minify] of [
    [values.umd, false],
    [values.min, true]
  ]) {
    if (outfile) {
      await bundle(outfile, 'cjs', {
        banner: umdBanner,
        footer: umdFooter,
        minify
      });
    }
  }
};

await build();
if (values.watch) {
  watch(values.watch, { recursive: true }, () => build().catch(console.error));
}
