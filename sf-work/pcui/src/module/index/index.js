// import 'common/theme/index-#215283.css'//放在common.css前
import 'common/css/common.less'
// import 'common/css/skinBlue.css'
// import 'common/css/switchSkin.less'//放在common.css后
import 'common/font/iconfont.css'
import 'common/fontNew/iconfont.css'
import 'common/css/radio.css'

import 'babel-polyfill'

import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

import ElementUI from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

import VueResourceExt from 'common/js/resourceExt.vue.plugin'
Vue.use(VueResourceExt) 

import VueMethod from 'common/js/method.vue.plugin'
Vue.use(VueMethod)

import VueMath from 'common/js/math.vue.plugin'
Vue.use(VueMath)

import VueDict from 'common/js/dicTool.vue.plugin'
Vue.use(VueDict)

import ViserVue from 'viser-vue'
Vue.use(ViserVue)


/*粘贴板*/
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

/*axios*/
import axios from 'axios'
axios.defaults.withCredentials = true
Vue.prototype.$axios = axios;
//
let lang;
if (window.sessionStorage.getItem('lang')) {
	lang = window.sessionStorage.getItem('lang')
}else {
	lang = 'zh-CN'
}
const i18n = new VueI18n({
    locale: lang,    // 语言标识
    //this.$i18n.locale // 通过切换locale的值来实现语言切换
    messages: {
      'zh-CN': require('common/js/i18n/zh'),   // 中文语言包
      'en': require('common/js/i18n/en')    // 英文语言包
    }
})

Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
})
/**
 * 最新的埋点插件 SfGather-js (是否引入根据项目实际情况)
 */
import VueSfgather from 'common/js/sfgather.vue.plugin'
Vue.use(VueSfgather, {
		debug: false,
		url: SfGATHERURL, //埋点上报地址
		app_id: 'sfopen', //注册应用时生成的appId,必传字段  请联系徐芾清(01369308)申请注册  
		platform: 'pc' //平台类型 
})

import store from 'store'

if (!window.sessionStorage.getItem('lang') || !store.state.global.i18nFlag) {
	window.sessionStorage.setItem('lang','zh-CN')
}

/* eslint-disable no-new */

/*import copyItem from '../../components/example/copyItem.vue'
Vue.use(copyItem)*/
import App from './App'
var sfopenpc = new Vue({
	el: '#app',
	render: h => h(App),
	store,
	i18n,
	/*components: {
		copyItem
	},*/
});
