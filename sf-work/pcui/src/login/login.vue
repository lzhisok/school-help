<template>
	<div>
		<div class="login-header">
			<div class="w1100">
				<img class="login-logo" src="../common/images/logo.png" />
				<span class="login-span">{{$t('userlogin.sfopen')}}</span>
			</div>
		</div>
		<div class="login-bg">
			<router-view/>
		</div>
		<div class="login-footer clear">
			<span @click="switchLang('zh-CN')" class="login-fooger-a">简体</span>|<span @click="switchLang('en')" class="login-fooger-a">English</span>
		</div>
	</div>
</template>

<script>
	export default {
		methods: {
			switchLang(command) {
				window.sessionStorage.setItem('lang', command);
				this.$i18n.locale = command;
				if(command == 'en-US') {
					window.sessionStorage.setItem('lang', 'en');
				} else {
					window.sessionStorage.setItem('lang', command);
				}
				window.location.reload();
			}
		}
	};
</script>

<style scoped="scoped" type="text/css">
	.login-header {
		height: 70px;
		line-height: 70px;
		background: #fff;
	}
	
	.login-header .login-logo {
		float: left;
		padding-top: 15px;
		width: 40px;
	}
	
	.login-header .login-span {
		display: inline-block;
		float: left;
		padding-left: 15px;
		font-size: 20px;
		color: #333;
	}
	
	.login-bg {
		height: 610px;
		background: url(/static/img/login-bg.jpg) no-repeat;
		background-size: auto 100%;
		background-position: top center;
		transform: ;
	}
	.login-footer{
		width: 100%;
		height: 100px;
		text-align: center;
		color: #777;
	}
	.login-fooger-a{
		padding: 0 20px;
		line-height: 100px;
		font-size: 14px;
		
		cursor: pointer;
	}
	.login-fooger-a:hover{
		color: #333;
	}
</style>