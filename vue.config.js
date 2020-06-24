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
  },

  
  // chainWebpack: config => {
  //   // 发布模式
  //   config.when(process.env.NODE_ENV === 'production', config => {
  //     config.entry('app').clear().add('./src/main-prod.js')

  //     config.set('externals', {
  //       vue: 'Vue',
  //       'vue-router': 'VueRouter',
  //       axios: 'axios',
  //       lodash: '_',
  //       echarts: 'echarts',
  //       nprogress: 'NProgress',
  //       'vue-quill-editor': 'VueQuillEditor'
  //     })

  //     config.plugin('html').tap(args => {
  //       args[0].isProd = true
  //       return args
  //     })
  //   })

  //   // 开发模式
  //   config.when(process.env.NODE_ENV === 'development', config => {
  //     config.entry('app').clear().add('./src/main-dev.js')

  //     config.plugin('html').tap(args => {
  //       args[0].isProd = false
  //       return args
  //     })
  //   })
  // }

}
