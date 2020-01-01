const { rollup } = require('rollup-1.19.2');
const tests = require('./tests');

describe('rollup-plugin-vuedoc with legacy rollup (v1.19.2)', tests(rollup));
