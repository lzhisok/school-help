import { Message } from 'element-ui'
import store from 'store'
import util from './util/common'
import cookieUtil from './util/cookie'
import md5 from 'js-md5'

let fromDisable = true;//表单可提交状态

export default {
	install(Vue) {
		// 1. 添加全局方法或属性
		/*Vue.myGlobalMethod = function() {
			// 逻辑...
			alert(1);
		}
		// 2. 添加全局资源
		Vue.directive('my-directive', {
			bind(el, binding, vnode, oldVnode) {
				// 逻辑...
			}
		})
		// 3. 注入组件
		Vue.mixin({
			created: function() {
				// 逻辑...
			}
		})*/

		/**
		 * @author：ww
		 * @function: 人员单选选择框
		 * @pramas: el-autocomplete 必须基于这个控件使用	   
		 */
		Vue.prototype.$singlePersonSelect = function (queryString, cb) {
			var that = this;
			if (/^[\u4e00-\u9fa5]/g.test(queryString) || /^\d{3,}$/.test(queryString)) {
				this.timeOut && clearTimeout(this.timeOut);
				this.timeOut = setTimeout(function () {
					that.$httpExt().post('common/queryEmp', {
						pageNum: 1,
						pageSize: 10,
						likeStr: queryString
					}).then(function (response) {
						const results = response.result.list;
						for (let [index, item] of results.entries()) {
							item.value = item.lastName + '(' + item.empNum + ')';
						}
						cb(results);
					}, function (response) {
						Message({
							message: response.msg,
							type: 'warning'
						});
					});
				}, 500)
			} else {
				cb([]);
			}
		}
		/**
		 * @author：ww
		 * @function: 组织单选选择框
		 * @pramas: el-autocomplete 必须基于这个控件使用	   
		 */
		Vue.prototype.$singleOrgSelect = function (queryString, cb) {
			var that = this;
			if (/^[\u4e00-\u9fa5]/g.test(queryString) || /^[A-Za-z0-9]{2,}$/.test(queryString)) {
				this.timeOut && clearTimeout(this.timeOut);
				this.timeOut = setTimeout(function () {
					that.$httpExt().post('common/queryOrg', {
						paging: 1,
						pageNum: 1,
						pageSize: 10,
						likeStr: queryString,
						region: 'all'
					}).then(function (response) {
						const results = response.result.list;
						for (let [index, item] of results.entries()) {
							item.value = item.orgName;
						}
						cb(results);
					}, function (response) {
						Message({
							message: response.msg,
							type: 'warning'
						});
					});
				}, 500)
			} else {
				cb([]);
			}
		}
		/**
		 * @author：xmj
		 * @function: 防重
		 * @pramas: btn  可传可不传 传了btn置灰	   
		 */
		Vue.prototype.$checkPrevent = function (btn) {
			if (fromDisable) { // 验证表单状态是否为可以提交状态
				fromDisable = false; // 点击后 把状态改为 不可提交
				setTimeout(function () {
					fromDisable = true;
				}, 3000) // 三秒之后把表单状态重新设置为可提交
				if (typeof btn != 'undefined') { // 验证是否传入值
					btn.style.background = '#ddd' // 把按钮颜色置灰
					btn.style.color = '#fff' // 把按钮颜色置灰
					btn.style.border = 0 // 把按钮颜色置灰
					setTimeout(function () {
						btn.style.background = '';
						btn.style.color = '';
						btn.style.border = '';
					}, 3000) // 三秒后重新改为启用
				}
				return true; // 如果状态为可提交 返回true
			} else {
				return false;
			}
		}
		Vue.prototype.$setCookie = cookieUtil.setCookie
		Vue.prototype.$getCookie = cookieUtil.getCookie
		Vue.prototype.$delAllCookie = cookieUtil.delAllCookie
		Vue.prototype.$numberDigits = util.numberDigits
		Vue.prototype.$format = util.dateFormat
		Vue.prototype.$deepCopy = util.deepCopy
		Vue.prototype.$merge = util.merge
		Vue.prototype.$md5 = md5
	}
}