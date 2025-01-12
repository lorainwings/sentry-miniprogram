import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import babel from '@rollup/plugin-babel'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts';
import path from 'path';

const __filename = new URL(import.meta.url).pathname
const __dirname = path.dirname(__filename)
const isPlatform = process.env.IS_BUILD_PLATFORM;
let configs = [];

const production = process.env.NODE_ENV === 'production';

// 基础配置
const baseConfig = (d = './dist') => ({
  input: './src/index.ts',
  plugins: [
    resolve({ preferBuiltins: true }),
    commonjs(),
    typescript({
      compilerOptions: {
        sourceMap: !production,
        declaration: false,
        declarationMap: false,
        outDir: d,
        declarationDir: d
      }
    }),
    babel({
      sourceMaps: true,
      babelHelpers: 'runtime',
      extensions: ['.js', '.ts'],
      configFile: path.resolve(__dirname, 'babel.config.cjs')
    }),
    terser()
  ]
});


// 平台特定的输出配置
const platforms = [
  { name: 'dd', folder: 'ddapp' },
  { name: 'my', folder: 'myapp' },
  { name: 'qq', folder: 'qq' },
  { name: 'swan', folder: 'swan' },
  { name: 'tt', folder: 'ttapp' },
  { name: 'wx', folder: 'weapp' },
  { name: 'wx', folder: 'wegame' }
];

// 生成每个平台的配置

if (isPlatform) {
  configs = platforms.map(platform => {
    const d = path.resolve(__dirname, `./examples/${platform.folder}/vendor`);
    return {
      ...baseConfig(d),
      output: {
        file: path.resolve(__dirname, `${d}/sentry-miniapp.${platform.name}.min.js`),
        format: 'cjs',
        sourcemap: true
      }
    }
  });
} else {
  // 全部生成到dist目录, 用于发布, 打包成esm和cjs两种格式
  configs = ['cjs', 'esm'].map(format => ({
    ...baseConfig(),
    output: {
      file: path.resolve(__dirname, `./dist/index.${format}.js`),
      format: format,
      sourcemap: true
    }
  }));
  // 添加处理.d.ts文件的配置
  configs.push({
    input: './dts/index.d.ts',
    output: [{
      file: path.resolve(__dirname, './dist/index.d.ts'),
      format: 'es'
    }],
    plugins: [
      resolve(),
      commonjs(),
      dts()
    ]
  });
}


export default configs; 