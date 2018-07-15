'use strict'
const URL  = require('./request.json');
const target = process.env.npm_lifecycle_event
let obj = {}
if(target === 'sit') {
	obj = {
		NODE_ENV: '"production"',
		_BASEURL: `'${URL.sit.baseURL}'`
	}
} else {
	obj = {　　
		NODE_ENV: '"production"',
		_BASEURL: `'${URL.prd.baseURL}'`
	}
}
module.exports = obj;