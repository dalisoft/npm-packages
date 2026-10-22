import assert from 'node:assert/strict';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import libExport from './lib.js';

test('Wraps a pure ES module into an universal module', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'lib-export-'));
  const output = join(dir, 'simple.umd.js');

  try {
    await libExport({
      file: fileURLToPath(new URL('./fixtures/simple.js', import.meta.url)),
      name: 'Simple',
      output
    });

    const result = await readFile(output, 'utf-8');

    assert.match(result, /\}\)\('Simple', function\(/);
    assert.match(result, /globalModule\.default = Simple;/);
    assert.doesNotMatch(result, /^export /m);
  } finally {
    await rm(dir, { force: true, recursive: true });
  }
});
