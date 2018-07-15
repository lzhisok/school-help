'use strict'
const URL  = require('./request.json')
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
module.exports = merge(prodEnv, {
	NODE_ENV: '"development"',
	_BASEURL: `'${URL.dev.baseURL}'`
})