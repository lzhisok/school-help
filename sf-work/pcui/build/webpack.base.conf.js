var path = require('path')
var config = require('../config')
var utils = require('./utils')
var loaderConfig = require('./vue-loader.conf.js')
var projectRoot = path.resolve(__dirname, '../')
var entries = utils.getEntry('./src/module/**/*.js') // 获得入口js文件

var env = process.env.NODE_ENV
// check env & config/index.js to decide weither to enable CSS Sourcemaps for the
// various preprocessor loaders added to vue-loader at the end of this file
var cssSourceMapDev = (env === 'development' && config.dev.cssSourceMap)
var cssSourceMapProd = (env === 'production' && config.build.productionSourceMap)
var useCssSourceMap = cssSourceMapDev || cssSourceMapProd
var publicPath = env === 'production' ? config.build.assetsPublicPath : config.dev.assetsPublicPath

module.exports = {
  entry: {
  	app: './src/module/index/index.js',
		login: './src/login/index.js'
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: publicPath,
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.less', '.sass', '.css', '.js', '.vue'],
    alias: {
      'vue$': 'vue/dist/vue.common',
      '@antv': '@antv',
      'src': path.resolve(__dirname, '../src'),
      'store': path.resolve(__dirname, '../src/store'),
      'common': path.resolve(__dirname, '../src/common'),
      'components': path.resolve(__dirname, '../src/components'),
      'static': path.resolve(__dirname, '../static'),
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: {
          loader: 'vue-loader',
          options: loaderConfig
        }
      },
      {
        test: /\.js$/,
        include: projectRoot,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.json$/,
        use: 'json-loader'
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]')
          }
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
          }
        }
      }
    ]
  }
}
