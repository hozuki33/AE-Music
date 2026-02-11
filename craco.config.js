// craco.config.js
const path = require('path');
const CracoLessPlugin = require('craco-less'); // 引入 craco-less

const resolve = (dir) => path.resolve(__dirname, dir);

module.exports = {
  webpack: {
    alias: {
      '@': resolve('src')
    }
  },
  // 新增：配置 craco-less 插件
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          // 若需要自定义 Less 变量，可在此配置（可选）
          lessOptions: {
            modifyVars: { '@primary-color': '#1DA57A' }, // 示例：自定义 Ant Design 主题色
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};