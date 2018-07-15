import dict from './util/dict'

/**
 * @author：qm
 * @function: 数据字典方法调用
 * @pramas: 1.pkeypath 必填
 */
export default {
	install(Vue) {
		Vue.prototype.$dicTool = function () {
			return dict;
		}
	}
}