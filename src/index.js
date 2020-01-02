const { md } = require('@vuedoc/md');
const { dirname, resolve, join, parse, relative, format, basename } = require('path');

function match(target, test) {
  const arr = Array.isArray(test) ? test : [test];
  return arr.some((t) => {
    if (typeof t === 'string') return target === t;
    if (t instanceof RegExp) return t.test(target);
    throw new TypeError('The \'test\' option must be a string or a RegExp or an array of them.');
  }); 
}

module.exports = function vuedoc({ test, prefix = '', intro = '', outro = '', index } = {}) {

  if (!/function|string/.test(typeof intro) || !/function|string/.test(typeof outro)) {
    throw new TypeError('intro/outro option must be a function or a string.');
  }

  return {
    name: 'vuedoc',
    async buildStart({ input }) {
      this.vuedocInput = dirname(resolve(input));
      this.vuedocIndices = [];
    },
    async transform(code, id) {
      // Skip processing if ID does not match the test
      if (test !== undefined) {
        try {
          if (!match(id, test)) return null;
        } catch (e) {
          this.error(e);
        }
      }
      // Generate and emit markdown
      const doc = await md({ filename: id });
      if (!doc.length) return null;
      const introString = typeof intro === 'function' ? intro({ id }) : intro;
      const outroString = typeof outro === 'function' ? outro({ id }) : outro;
      const introLf = introString.length ? '\n' : '';
      const outroLf = outroString.length ? '\n' : '';
      const source = `${introString}${introLf}${doc}${outroLf}${outroString}`;
      const { dir, name } = parse(join(prefix, relative(this.vuedocInput, id)));
      const fileName = format({ dir, name, ext: '.md' });
      this.emitFile({ type: 'asset', source, fileName });
      // Generate and emit index
      if (!index) return null;
      const emitIndex = (dirPath) => {
        const indexPath = join(dirPath, 'index.md');
        if (this.vuedocIndices.includes(indexPath)) return;
        const indexContent = typeof index === 'function' ?
          index(dirPath):
          `# ${basename(dirPath || join(this.vuedocInput, prefix))}`;
        this.emitFile({ type: 'asset', source: indexContent, fileName: indexPath});
        this.vuedocIndices.push(indexPath);
        if (dirPath === prefix) return;
        emitIndex(dirname(dirPath));
      }
      emitIndex(dir);
      return null;
    },
  };
}
