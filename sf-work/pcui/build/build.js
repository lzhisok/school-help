var envInput = null
var args = process.argv.toString().split(",")
if ( args.length>2 ){
  envInput = args[2]
}
switch(envInput){
  case 'sit':
  case 'prd':
  case 'stg':
  case 'devdb':
    console.log('use env '+envInput);
    break
  default:
    console.log(
      '  Usage:\n' +
      '  npm run devdb\n' +
      '  npm run sit\n' +
      '  npm run stg\n' +
      '  npm run prd\n'
    );
    process.exit()
}

require('shelljs/global')
process.env.NODE_ENV = 'production'
process.env.CUR_ENV = envInput

var path = require('path')
var config = require('../config')
var ora = require('ora')
var webpack = require('webpack')
var webpackConfig = require('./webpack.prod.conf')

console.log(
  '  Tip:\n' +
  '  Built files are meant to be served over an HTTP server.\n' +
  '  Opening index.html over file:// won\'t work.\n'
)

var spinner = ora('building for production...')
spinner.start()

var assetsPath = path.join(config.build.assetsRoot, config.build.assetsSubDirectory)
rm('-rf', assetsPath)
mkdir('-p', assetsPath)
cp('-R', 'static/*', assetsPath)

webpack(webpackConfig, function (err, stats) {
  spinner.stop()
  if (err) throw err
  process.stdout.write(stats.toString({
    colors: true,
    modules: false,
    children: false,
    chunks: false,
    chunkModules: false
  }) + '\n')
})
