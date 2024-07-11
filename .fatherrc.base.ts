import { defineConfig } from 'father';

export default defineConfig({
  // esm: { output: 'es' },
  // cjs: { output: 'lib' },
  // umd: { output: 'dist' },
  esm: {},
  cjs: {},
  umd: {},
  prebundle: {
    deps: {}
  },
  sourcemap: true,
});

// 默认值为 dist/esm，如果想保持原目录，需增加 output 配置项
// 如: output: 'es'
