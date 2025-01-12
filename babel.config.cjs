module.exports = {
  targets: { browsers: ['last 2 versions', 'not dead', '> 0.05%'] },
  plugins: [
    // 添加 transform-runtime 插件
    ['@babel/plugin-transform-runtime', {
      corejs: {
        proposals: true,
        version: 3
      }
    }]
  ],
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ]
  ]
}
