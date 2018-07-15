import Vue from 'vue'
import login from './login'
import router from './router.js'
import ElementUI from 'element-ui'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css'
import '../common/css/common.less'
import '../common/css/login.less'
import store from 'store'

import VueI18n from 'vue-i18n'
Vue.use(VueI18n)

import VueResourceExt from 'common/js/resourceExt.vue.plugin'
Vue.use(VueResourceExt) 

import VueMethod from 'common/js/method.vue.plugin'
Vue.use(VueMethod)

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

Vue.config.productionTip = false;

/* eslint-disable */
new Vue({
	el: '#login',
	store,
	router,
	i18n,
	components: {login},
	template: '<login/>'
});

