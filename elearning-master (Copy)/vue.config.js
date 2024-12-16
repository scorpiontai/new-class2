const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/captcha/general': {
        target: 'https://3823-114-10-23-41.ngrok-free.app/',
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/captcha/general': '/captcha/general'
        }
      },
    },
  },
  chainWebpack: config => {
    config.module
      .rule('raw')
      .test(/\.txt$/)
      .use('raw-loader')
      .loader('raw-loader')
      .end()
  },
});
