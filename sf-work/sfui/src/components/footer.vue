<template>
    <div class="footer-tabbar">
        <v-tabbar @on-index-change="onIndexChange" v-model="activeComputed">
            <v-tabbar-item :link="{path:'/match'}">
                <img slot="icon" src="../assets/images/match.png">
                <img slot="icon-active" src="../assets/images/match-active.png">
                <span slot="label">赛事</span>
            </v-tabbar-item>
            <v-tabbar-item :link="{path:'/community'}">
                <img slot="icon" src="../assets/images/community.png">
                <img slot="icon-active" src="../assets/images/community-active.png">
                <span slot="label">社区</span>
            </v-tabbar-item>
            <v-tabbar-item :link="{path:'/rank'}">
                <img slot="icon" src="../assets/images/rank.png">
                <img slot="icon-active" src="../assets/images/rank-active.png">
                <span slot="label">排行</span>
            </v-tabbar-item>
            <v-tabbar-item :link="{path:'/user'}">
                <img slot="icon" src="../assets/images/user.png">
                <img slot="icon-active" src="../assets/images/user-active.png">
                <span slot="label">我的</span>
            </v-tabbar-item>
        </v-tabbar>
    </div>
</template>
<script>
import Vue from 'vue';
import axios from 'axios';
	export default {
		data() {
			return {
				title: '',
				showHeader: window.showHeader,
			}
		},
		props: [
			'active'
		],
		watch: {
			$route: 'path',
		},
		computed: {
			activeComputed: {
				get() {
					return this.active * 1;
				},
				set() {

				}
			}
		},
		mounted() {
			// // 如果不使用丰声统一头部，需要设置状态栏颜色调用该方法
			// this.setBackgroundColor();
		},
		methods: {
			onIndexChange (newIndex, oldIndex) {
				// this.active = newIndex
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
<style lang="less">

	.app{
		width: 100%;
		height: 100%;
		overflow-y: auto;
	}
	.show-header {
		position: absolute;
		width: 100%;
		top: 0;
		bottom: 53px;
		margin: auto;
	}
	.hide-header {
		height: calc(100vh);
	}
	.router-view{
		height:100%;
		overflow-y: auto;
		position: relative;
	}
	.footer-tabbar{
		position: absolute;
		width: 100%;
		bottom: 0;
		height: 53px;
	}
	.sfmui-tabbar__item.sfmui-bar__item_on .sfmui-tabbar__label {
		color: #f7c300;
	}
</style>