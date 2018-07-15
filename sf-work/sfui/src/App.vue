<template>
	<div class="app">
		<!-- <template v-if="showHeader">
			<v-navbar :title="title">
			</v-navbar>
		</template> -->
		<div :class="{'show-header':showHeader,'hide-header':!showHeader}">
			<router-view class="router-view"></router-view>
		</div>		
	</div>
</template>

<script>
import Vue from 'vue';
import axios from 'axios';
	export default {
		data() {
			return {
				title: '',
				showHeader: window.showHeader
			}
		},
		watch: {
			$route: 'path'
		},
		mounted() {
			//如果不使用丰声统一头部，需要设置状态栏颜色调用该方法
			//this.setBackgroundColor();
			
		},
		methods: {
			onIndexChange (newIndex, oldIndex) {
				// console.log(newIndex, oldIndex)
			},
			setBackgroundColor() {
				function getSucess() {
					console.log('webview背景色设置成功');
				}

				function getFailed() {
					console.log('webview背景色设置失败');
				}
				try {
					ExpressPlugin.setWebViewBackgroundColor(getSucess, getFailed, '#4C4B53');
				} catch(e) {
					console.log('设置失败');
				}
			},
			back() {
				// 增加项目中的主页用来跳转到微服务页面
				if(this.$route.path == '/' || this.$route.path == '/hello') {
					this.close();
				} else {
					this.$router.go(-1);
				}
			},
			close() {
				try {
					ExpressPlugin.backToWidget();
				} catch(e) {
					console.log('返回插件调用失败');
				}
			},
			path() {
				if(this.$route.meta && this.$route.meta.title){
					this.title = this.$route.meta.title
					try {
						ExpressPlugin.setNavigationBarTitle(() => { //设置丰声导航栏title    
						}, () => {}, this.title);
					} catch(e) {
						//设置失败
					}
				}
			}
		}
	}
</script>
<style lang="less" scoped>
	/*阻止默认长按选中文本*/
	*{
		-webkit-user-select:none; /*webkit浏览器*/
		-khtml-user-select:none; /*早期浏览器*/
		-moz-user-select:none;/*火狐*/
		-ms-user-select:none; /*IE10*/
		user-select:none;
	}
	input,textarea {
		user-select:auto; /*webkit浏览器*/
		margin: 0px;
		padding: 0px;
		outline: none;
	}
	body{
		overflow-x: hidden;
	}
	.navbar-demo2 .sfmui-header-left .left-arrow:before {
		border: 2px solid #292727!important;
		border-width: 2px 0 0 2px!important;
	}
	.navbar-demo2 .sfmui-header-left a, .navbar-demo2 .sfmui-header-right a, .navbar-demo2 .sfmui-header-title, .navbar-demo2 .sfmui-header h1 {
    color: #292727!important;
}
	.app{
		width: 100%;
		height: 100%;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
	.show-header,
	.hide-header {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 0!important;
		margin: auto;
	}
	.hide-header {
		// height: calc(100vh);
		height: auto!important;
	}
	.router-view{
		height:100%;
		overflow-y: auto;
	}
	.sfmui-tabbar__item.sfmui-bar__item_on .sfmui-tabbar__label {
		color: #f7c300;
	}
</style>