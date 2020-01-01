const { rollup } = require('rollup');
const tests = require('./tests');

describe('rollup-plugin-vuedoc with latest rollup', tests(rollup));
