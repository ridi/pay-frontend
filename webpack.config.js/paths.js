const { join } = require('path');
const { tmpdir } = require('os');

const baseDir =  process.cwd();
const tempDir = tmpdir();

module.exports = {
  baseDir,
  srcDir: join(baseDir, 'src'),
  outputDir: join(baseDir, 'dist'),
  publicDir: join(baseDir, 'public'),
  cacheRoot: `${tempDir}/.r_ulmtd_cache`,
};
