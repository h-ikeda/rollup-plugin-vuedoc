const { resolve, basename } = require('path');
const { md } = require('@vuedoc/md');
const vuedoc = require('../src/index');

module.exports = (rollup, { assetObject }) => () => {
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
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
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
        source: a,
      }),
      expect.objectContaining({
        fileName: 'tmp/test-component-b.md',
        source: b,
      }),
      expect.objectContaining({
        fileName: 'tmp/test-directory/test-component-c.md',
        source: c,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
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
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
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
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
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
        source: a,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
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
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
    ]));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'index.md' }));
    expect(output).not.toContainEqual(expect.objectContaining({ fileName: 'test-component-b.md' }));
  });
  test('rollup should output markdowns that starts with intro option string', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ intro: 'Prepended by intro option' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: `Prepended by intro option\n${a}`,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: `Prepended by intro option\n${b}`,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: `Prepended by intro option\n${c}`,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should output markdowns that starts with intro option function', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ intro: ({ id }) => `${id}` })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: `${resolve(__dirname, 'fixtures/basic/test-component-a.js')}\n${a}`,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: `${resolve(__dirname, 'fixtures/basic/test-component-b.js')}\n${b}`,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: `${resolve(__dirname, 'fixtures/basic/test-directory/test-component-c.js')}\n${c}`,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should output markdowns that starts with outro option string', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ outro: 'Appended by outro option' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: `${a}\nAppended by outro option`,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: `${b}\nAppended by outro option`,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: `${c}\nAppended by outro option`,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should output markdowns that starts with outro option function', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ outro: ({ id }) => `${id}` })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: `${a}\n${resolve(__dirname, 'fixtures/basic/test-component-a.js')}`,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: `${b}\n${resolve(__dirname, 'fixtures/basic/test-component-b.js')}`,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: `${c}\n${resolve(__dirname, 'fixtures/basic/test-directory/test-component-c.js')}`,
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should generate index markdowns', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ index: true })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
      expect.objectContaining({
        fileName: 'test-directory/index.md',
        source: '# test-directory',
      }),
      expect.objectContaining({
        fileName: 'index.md',
        source: '# basic',
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should dynamically generate index markdowns', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ index: (dir) => `title: ${dir}` })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: a,
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: b,
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c,
      }),
      expect.objectContaining({
        fileName: 'test-directory/index.md',
        source: 'title: test-directory',
      }),
      expect.objectContaining({
        fileName: 'index.md',
        source: 'title: ',
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should generate index markdowns with prefix', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ index: true, prefix: 'pre-dir' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'pre-dir/test-component-a.md',
        source: a,
      }),
      expect.objectContaining({
        fileName: 'pre-dir/test-component-b.md',
        source: b,
      }),
      expect.objectContaining({
        fileName: 'pre-dir/test-directory/test-component-c.md',
        source: c,
      }),
      expect.objectContaining({
        fileName: 'pre-dir/test-directory/index.md',
        source: '# test-directory',
      }),
      expect.objectContaining({
        fileName: 'pre-dir/index.md',
        source: '# pre-dir',
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
  test('rollup should not generate index markdowns upside prefix path', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ index: true, prefix: 'pre-dir' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).not.toContainEqual(expect.objectContaining({
      fileName: 'index.md',
    }));
  });
  test('rollup should not dynamically generate index markdowns upside prefix', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ index: (dir) => `title: ${dir}`, prefix: 'pre-dir' })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).not.toContainEqual(expect.objectContaining({
      fileName: 'index.md',
    }));
  });
  test('rollup should output markdown documents with replacements', async () => {
    const bundle = await rollup({
      input: resolve(__dirname, 'fixtures/basic/index.js'),
      plugins: [vuedoc({ replace: { test: /explaination/g, replacement: 'replaced' } })],
    });
    const { output } = await bundle.generate({ format: 'esm' });
    expect(output).toEqual(expect.arrayContaining([
      expect.objectContaining({
        fileName: 'test-component-a.md',
        source: a.replace(/explaination/g, 'replaced'),
      }),
      expect.objectContaining({
        fileName: 'test-component-b.md',
        source: b.replace(/explaination/g, 'replaced'),
      }),
      expect.objectContaining({
        fileName: 'test-directory/test-component-c.md',
        source: c.replace(/explaination/g, 'replaced'),
      }),
    ]));
    expect(output).toEqual(expect.arrayContaining([
      assetObject(),
      assetObject(),
      assetObject(),
    ]));
  });
};
