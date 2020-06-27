module.exports = {
  publicPath: './',
  configureWebpack:{
    resolve:{
      alias:{
        'components':'@/components',
        'network':'@/network',
        'views':'@/views'
      }
    }
  },
  productionSourceMap:false,
  outputDir: 'dist',
  assetsDir: 'assets',
  lintOnSave: false,
  devServer: {
    open: true,
    host: "localhost",
    port: '80',
    https: false,
    hotOnly: true,
    proxy: {
      '/api': {
        target: 'https://music.163.com/api/', //API服务器的地址
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        },
        // 突破host和origin的限制
        headers: {
          referer: 'http://music.163.com',
          origin: 'http://music.163.com',
          host: 'music.163.com'
        }
      },
    },
  }

}
