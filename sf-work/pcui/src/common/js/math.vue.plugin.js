import math from './util/math'

/**
 * 精确计算样例
 * const a = 1
 * const b = 2
 * const sum = this.$math.eval(`${a}+${b}`, 2) // 结果 3.00
 */
export default {
	install(Vue) {
		Vue.prototype.$math = math
	}
}
