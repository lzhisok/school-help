import axios from 'axios'
import store from 'store'
import cookieUtil from './util/cookie'

let jumpFlag = true

const action = function (url, method, dat, opt) {
	const data = dat || {}
	const option = opt || {}
	option.headers = option.headers || {}
	option.headers['SfopenReferer'] = window.location
	option.headers['lang'] = window.sessionStorage.getItem('lang')
	option.withCredentials = true
	const promise = new Promise((resolve, reject) => {
		let req
		if (/^p/.test(method)) {
			req = axios[method](url, data, option)
		} else {
			option.params = data
			req = axios[method](url, option)
		}
		req.then((response) => {//NOSONAR
			let tmp = response.data
			if (typeof (tmp) === 'string') {
				try {
					tmp = JSON.parse(tmp)
				} catch (e) {
				}
			}
			if (tmp.succ.toLowerCase() === "ok") {
				resolve(tmp)
			} else if (tmp.succ.toLowerCase() === "jump") {
				if (jumpFlag && tmp.result.redirect) {
					jumpFlag = false;
					window.location.href = tmp.result.redirect;
				}
			}else if (tmp.succ.toLowerCase() === "login") {
				window.location.href = "/login/index.html";
				
			} else if (tmp.succ.toLowerCase() === "logout") {
				if (jumpFlag && tmp.result.logout && tmp.result.login) {
					jumpFlag = false;
					new Image().src = tmp.result.logout
					setTimeout(function () {
						cookieUtil.delAllCookie()
						window.location.href = tmp.result.login
					}, 100)
				}
			}else {
				reject(tmp)
			}
		}, () => {
			reject({ msg: '网络异常，请刷新页面或者联系系统管理员！' })
		})

	})
	return promise
}

const httpExt = {
	put(url, data, option) {
		return action(url, 'put', data, option)
	},
	putForm(url, data, option) {
		const opt = option || {}
		opt.headers = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
		}
		opt.emulateJSON = true
		return action(url, 'put', data, opt)
	},
	post(url, data, option) {
		return action(url, 'post', data, option)
	},
	postJson(url, data, option) {
		return action(url, 'post', data, option)
	},
	postForm(url, data, option) {
		const opt = option || {}
		opt.headers = {
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
		}
		opt.emulateJSON = true
		return action(url, 'post', data, opt)
	},
	get(url, data, option) {
		/**添加时间戳,防止ie有缓存*/
		const data2 = data ? Object.assign(data, { time: new Date().getTime() }) : data;
		return action(url, 'get', data2, option)
	},
	delete(url, data, option) {
		return action(url, 'delete', data, option)
	}
}

export default {
	install(Vue) {
		axios.defaults.baseURL = store.state.global.url
		Vue.prototype.$axios = axios
		Vue.prototype.$httpExt = function () {
			return httpExt
		}
	}
}