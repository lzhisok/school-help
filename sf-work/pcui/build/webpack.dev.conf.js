var path = require('path');
var webpack = require('webpack')
var merge = require('webpack-merge')
var config = require('../config')
var utils = require('./utils')
var baseWebpackConfig = require('./webpack.base.conf')
var HtmlWebpackPlugin = require('html-webpack-plugin')

// add hot-reload related code to entry chunks
Object.keys(baseWebpackConfig.entry).forEach(function(name) {
    baseWebpackConfig.entry[name] = ['./build/dev-client'].concat(baseWebpackConfig.entry[name])
})

var webpackConfig = merge(baseWebpackConfig, {
    devtool: '#eval-source-map',
    module: {
        rules: utils.styleLoaders({
            sourceMap: config.dev.cssSourceMap
        })
    },
    plugins: [
        new webpack.DefinePlugin(require('../configenv/devdb.js')),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new HtmlWebpackPlugin({
            template : './src/module/index/index.html',
            filename : 'module/index.html',
            hash: true,
            inject : true,
            chunks : ['app']
        }),
        new HtmlWebpackPlugin({
            template : './src/login/index.html',
            filename : 'login/index.html',
            hash: true,
            inject : true,
            chunks : ['login']
        })
    ]
})

//var pages = utils.getEntry('./src/module/**/*.html');
//
//
//for (var pathname in pages) {
//  // 配置生成的html文件，定义路径等
//  var conf = {
//      filename: pathname + '.html',
//      template: pages[pathname], // 模板路径
//      inject: true, // js插入位置
//      chunksSortMode: 'dependency'
//
//  };
//
//  if (pathname in webpackConfig.entry) {
//      conf.chunks = [pathname]
//      conf.hash = true
//  }
//
//  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
//}


module.exports = webpackConfig