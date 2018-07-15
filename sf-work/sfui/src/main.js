import Vue from 'vue'
import App from './App'

import VueRouter from 'vue-router'
Vue.use(VueRouter)

// 路由信息
import routes from './router/routerMap.js'

//引入sfmui框架 （根据项目实际使用引入对应的组件）
import 'sfmui/dist/css/sfmui.min.css'
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
import '../static/css/playerVideo.css'
import { Navbar,Tabbar,TabbarItem,Flexbox, FlexboxItem, Badge, Sticky, Spinner, Toast, Modal} from 'sfmui'
Vue.component(Navbar.name, Navbar);
Vue.component(Tabbar.name, Tabbar);
Vue.component(TabbarItem.name, TabbarItem);
Vue.component(Flexbox.name, Flexbox);
Vue.component(FlexboxItem.name, FlexboxItem);
Vue.component(Badge.name, Badge);
Vue.component(Spinner.name, Spinner);
Vue.use(Sticky);
Vue.use(Toast);
Vue.use(Modal);
// Vue.prototype.$toast = Toast

import VueDict from './comm/js/dicTool.vue.plugin'
Vue.use(VueDict)

// loading
import Loading from './modules/loading'
Vue.component(Loading.name, Loading);
// 请求
import axios from 'axios'
import qs from 'qs'
axios.defaults.timeout =  6000;
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
axios.defaults.withcredentials = true

/**
 * 统一设置后台请求地址
 * 设置请求地址：config文件夹下的request.json
 */
window._imgConfigUrl = process.env._BASEURL
axios.defaults.baseURL = process.env._BASEURL
// axios.defaults.baseURL = 'http://sfim-common.sit.sf-express.com/sfimecsauth/css'
Vue.prototype.$axios = axios

//POST传参序列化(添加请求拦截器)，该序列化方式也是根据实际情况加与不加
axios.interceptors.request.use((config) => {
	//在发送请求之前如果为post序列化请求参数
	if(config.method === 'post') {
		// config.data = qs.stringify(config.data);
	}
	return config;
}, (error) => {
	sfopenVM.$toast.show({
		text: '传参错误，请检查！',
		type: 'text',
		time: 1000,
		width: "auto"
	});
	return Promise.reject(error);
});

//返回状态判断(添加响应拦截器)
axios.interceptors.response.use((res) => {
	//对响应数据做判断，与后台协议统一接口返回格式
	if(res.data.succ === 'fail') { //这个判断可根据实际情况修改
		sfopenVM.$toast.show({
			text: res.data.msg ? res.data.msg : '服务器请求失败，请重试！',
			type: 'text',
			time: 1500,
			width: "auto"
		});
		return Promise.reject(res);
	}
	return res;
}, (error) => {
	sfopenVM.$toast.show({
		text: '网络异常，请稍后再试！',
		type: 'text',
		time: 1500,
		width: "auto"
	});
	return Promise.reject(error);
});

import './comm/css/global.less'

//引入项目中公共的样式和js
//import './comm/css/X.less'
//import './comm/js/X.js'

/**
 * 引入适配js文件
 */
import './comm/js/flexible.js'

/**
 * 测试需要调试时开启
 */
// var { VConsole } = require('./comm/js/vconsole.min.js')
// new VConsole()

Vue.config.productionTip = false

/**
 * 最新的埋点插件 SfGather-js
 * 页面点击埋点插件(是否引入根据项目实际情况，确定使用时进入引入的sfgather.vue.plugin.js中修改对应的配置参数)
 */
//import VueSfgather from "./comm/js/sfgather.vue.plugin.js"
//Vue.use(VueSfgather)

/*
*设置丰声统一头部的title
* */
Vue.prototype.$setNavTitle = function(title){
    try{
        ExpressPlugin.setNavigationBarTitle(()=>{    //设置丰声导航栏title    
    	},()=>{                                
        },title);
    }catch(e){
        //设置失败
    }
}

const router = new VueRouter({
	base: __dirname,
	routes
})
/**
 * 监听丰声设备准备
 * 初始化Vue
 */
var sfopenVM;
window.showHeader = true;
if(process.env.NODE_ENV === "development") {
	sfopenVM = new Vue({
		router,
		el: '#app',
		template: '<App/>',
		components: {
			App
		}
	})
} else {
	// 生产环境需要确保cordova加载完成
	// document.addEventListener('deviceready', function() {
		/**
		 * 丰声版本 3.5.0及以上，才有默认头部
		 * 经与丰声项目组讨论，目前低于该版本的用户量可以忽略，如果项目实在要求可以考虑加版本判断，详情见上一个版本
		 */
		window.showHeader = false;
		sfopenVM = new Vue({
			router,
			el: '#app',
			template: '<App/>',
			components: {
				App
			}
		})
	// }, false);
}
