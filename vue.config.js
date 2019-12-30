// vue.config.js
module.exports = {
  // 部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? '/production-sub-path/' : '/',
  // 当运行 npm run build 时生成的生产环境构建文件的目录
  outputDir: 'dist',
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'public',
  // 是否在开发环境下通过 eslint-loader 在每次保存时 lint 代码
  lintOnSave: true,
  // 是否使用包含运行时编译器的 Vue 构建版本
  runtimeCompiler: true,
  // 如果你不需要生产环境的 source map，可以将其设置为 false 以加速生产环境构建
  productionSourceMap: true,
  // webpack 配置
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      // 为生产环境修改配置...
    } else {
      // 为开发环境修改配置...
    }
  },
  // css 配置
  css: {},
  // 开发环境配置
  devServer: {
    // 服务器地址
    host: '0.0.0.0',
    // 端口号
    port: 9999,
    // 是否开启 https
    https: false,
    // npm run serve 后是否打开浏览器
    open: false,
    // 如果你的前端应用和后端 API 服务器没有运行在同一个主机上，你需要在开发环境下将 API 请求代理到 API 服务器
    proxy: {
      '/api': {
        target: 'http://localhost:8888',
        ws: true,
        // 是否允许跨域
        changeOrigin: true,
        pathRewrite: {
          // 重写
          '^/api': '/api'
        }
      },
      '/foo': {
        target: 'http://localhost:7777'
      }
    }
  }
}
