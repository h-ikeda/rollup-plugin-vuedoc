const { resolve } = require('path');
const { md } = require('@vuedoc/md');
const vuedoc = require('../src/index');

module.exports = (rollup) => () => {
  let a, b, c;
  beforeAll(async () => {
    a = await md({
      filename: resolve(__dirname, 'fixtures/basic/test-component-a.js'),
    });
    b = await md({
      filename: resolve(__dirname, 'fixtures/basic/test-component-b.js'),
    });
    c = await md({
      filename: resolve(__dirname, 'fixtures/basic/test-directory/test-component-c.js'),
    });
  });
  test('rollup should output markdown documents', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc()],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        isAsset: true,
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        isAsset: true,
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        isAsset: true,
        source: c,
      }),
    ]));
  });
  test('rollup should not output empty markdowns', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc()],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
  });
  test('rollup should output markdowns to prefixed path', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ prefix: 'tmp' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'tmp/test-component-a.md',
        isAsset: true,
        source: a,
      }),
      expect.objectContaining({
        fileName: 'tmp/test-component-b.md',
        isAsset: true,
        source: b,
      }),
      expect.objectContaining({
        fileName: 'tmp/test-directory/test-component-c.md',
        isAsset: true,
        source: c,
      }),
    ]));
  });
  test('rollup should output markdowns only if those id passes regexp test', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ test: /nent-[bc]\.js$/ })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-b.md',
        isAsset: true,
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        isAsset: true,
        source: c,
      }),
    ]));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'test-component-a.md' }));
  });
  test('rollup should output markdowns only if those id passes regexp tests', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ test: [/nent-b\.js$/, /nent-c\.js$/] })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-b.md',
        isAsset: true,
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        isAsset: true,
        source: c,
      }),
    ]));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'test-component-a.md' }));
  });
  test('rollup should output markdowns only if those id equals test string', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ test: resolve(__dirname, 'fixtures/basic/test-component-a.js') })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        isAsset: true,
        source: a,
      }),
    ]));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'test-component-b.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({
      fileName: 'test-directory/test-component-c.md'
    }));
  });
  test('rollup should output markdowns only if those id equals test strings', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({
        test: [
          resolve(__dirname, 'fixtures/basic/test-component-a.js'),
          resolve(__dirname, 'fixtures/basic/test-directory/test-component-c.js'),
        ],
      })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        isAsset: true,
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        isAsset: true,
        source: c,
      }),
    ]));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'test-component-b.md' }));
  });
};
