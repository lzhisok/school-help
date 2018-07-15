<template>
	<!--登录-->
	<div class="w1100">
		<div class="login-box">
			<div>
				<div class="login-title">{{$t('userlogin.register')}}</div>
				<el-alert v-if="errorFlag" :title="errorMsg" type="error" show-icon :closable="false"></el-alert>
				<div class="login-form">
					<div class="login-form-item">
						<label>{{$t('userlogin.photoNumber')}}</label>
						<el-input class="login-input-2" :class="errorClass" v-model="form.username" :placeholder="$t('userlogin.photoNumber')"
								  @change="checkMobile" tabindex="1"></el-input>
					</div>
					<div class="login-form-item">
						<label>{{$t('userlogin.smsVerifyCode')}}</label>
						<el-input class="login-input-2 login-input-4" v-model="form.code"
								  :placeholder="$t('userlogin.verifyCode')" tabindex="2" ref="codeinput"></el-input>
						<el-button class="login-btn-2" type="text" @click="sendCode" :disabled="sending">{{sendMsg}}
						</el-button>
					</div>
					<div class="login-form-item">
						<label>{{$t('userlogin.passWord')}}</label>
						<el-input class="login-input-2" v-model="form.password" :class="errorClasspwd"  :placeholder="$t('userlogin.passWord')" type="password"
								  @change="checkPwd" tabindex="3"></el-input>
					</div>
					<div class="login-form-item">
						<label>{{$t('userlogin.retypePassword')}}</label>
						<el-input class="login-input-2" v-model="form.rePassword" :class="errorClassrepwd" :placeholder="$t('userlogin.retypePassword')" type="password" tabindex="4"  @keyup.enter.native="submit"></el-input>
					</div>
				</div>
				<el-button class="login-rbtn" type="text" @click="$router.push('/loginPage')">{{$t('userlogin.returnLogon')}}</el-button>
				<el-button class="login-submit" type="primary" @click="submit" tabindex="5">{{$t('userlogin.register')}}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import {Message} from 'element-ui';
	export default {
		data() {
			return {
				// 是否发送中
				sending: false,
				// 60秒倒计时
				countdown: 60,
				sendMsg: this.$t('userlogin.GettingSmsVerifyCode'),
				// 错误样式
				errorClass: '',
				errorClasspwd: '',
				errorClassrepwd: '',
				// 表单对象
				form: {
					username: '',
					code: '',
					password: '',
					rePassword:'',					
				},
				// 错误提示
				errorFlag: false,
				errorMsg: '',
				qrVisible:false,
			}
		},
		methods: {
			/* 校验手机号 */
			checkMobile(value) {
				const reg1 = /^[1][0-9]{10}$/;
				let flag = false;
				if (!reg1.test(value)) {//中国号段
					this.errorClass = 'input-error';
					this.errorFlag = true;
					this.errorMsg = '请输入正确的手机号'
				} else {
					this.errorClass = '';
					this.errorFlag = false;
					this.errorMsg = '';
					flag = true
				}
				return flag
			},
			/* 校验密码格式：6到16位 需同时包含字母和数字 */
			checkPwd(value) {
				const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[a-zA-Z0-9]{6,16}$/;
				let flag = false;
				if (!reg.test(value)) {
					this.errorFlag = true;
					this.errorClasspwd = 'input-error'
					this.errorMsg = '密码请输入6-16位数字字母组合'
				} else {
					this.errorFlag = false;
					this.errorMsg = '';
					this.errorClasspwd = ''
					flag = true
				}
				return flag
			},
			/* 获取短信验证码 */
			sendCode() {
				if (!!this.ifAllNull('username',this.form.username)||!this.checkMobile(this.form.username)) {
					return false
				}
				this.$httpExt().get('VerifyCode',{
					'id':this.form.username,
					'type':'msg',
					'subtype':'r'
				}).then(response => {
					this.$refs.codeinput.focus()
					this.form.code=''
					this.sending = true
					this.sendMsg = this.countdown + 's'
					const timer = setInterval(() => {
						this.countdown--;
						this.sendMsg = this.countdown + 's后重新发送';
						if (this.countdown === 0) {
							this.sendMsg = this.$t('userlogin.GettingSmsVerifyCode')
							this.sending = false;
							this.countdown = 120;
							clearInterval(timer)
						}
					}, 1000)
				}, response => {
					this.$notify.error({
						title: '异常',
						message: response.msg
					})
				})
			},
			/* 判断表单是否有空 */
			ifAllNull(k, v) {
				let checkJson = [{
					name: 'username',
					text: '手机号'
				}, {
					name: 'code',
					text: '短信验证码'
				}, {
					name: 'password',
					text: '新密码'
				}, {
					name: 'rePassword',
					text: '确认密码'
				}];
				for (const item of checkJson) {
					if (item.name === k && v === '') {
						this.errorFlag = true;
						this.errorMsg = '请输入' + item.text;
						return true
					}
				}
				return false
			},
			/* 表单校验 */
			submitValid() {
				for (let [k, v] of Object.entries(this.form)) {
					// 非空校验
					if (this.ifAllNull(k, v)) {
						return false
					}
				}
				// 手机号校验
				if (!this.checkMobile(this.form.username)) {
					return false
				}
				// 密码格式校验
				if (!(this.checkPwd(this.form.password))) {
					return false
				}
				// 两次密码是否一致
				if (this.form.password !== this.form.rePassword) {
					this.errorFlag = true;
					this.errorClassrepwd = 'input-error'
					this.errorMsg = '两次密码输入不一致';
					return false
				}else{
					this.errorClassrepwd = ''
					return true
				}
			},
			// TODO 等待接入APi
			submit() {
				if (this.submitValid()) {
					var that=this;
					this.$httpExt().get('admin/register',{
						'username':this.form.username,
						'password':this.$md5(this.form.password),
						'key':this.form.code,
						'verityType':'r'
					}).then(response => {
						let data = response
						Message({
								message: '注册成功，即将转入登录',
								type: 'success'
							});
						setTimeout(()=>{
							that.$router.push('/loginPage')
						},1200)
						/**初始化埋点 */
						SfGather.uid = data.userName//手动上报事件  pc登陆
						SfGather.init()
						this.$sfgather().addUserEvent('pc_register')
						/*埋点结束*/
					}, response => {
						this.$notify.error({
							title: '异常',
							message: response.msg
						})
					})
				}
			}
		}
	};
</script>

<style scoped="scoped" type="text/css">

.login-rbtn{
	float: left;
	margin-top: 30px;
    margin-bottom: 26px;
}
.qr-btn{
	position: absolute;
    top: 10px;
    right: 10px;
    width: 35px;
    height: 35px;
    background: url(../../common/images/qr.png) no-repeat center;
    cursor: pointer;
}
.qr-code{
	padding: 40px 0;
	text-align: center;
}
.qr-code-title{
	margin-bottom: 20px;
	height: 40px;
	line-height: 40px;
	color: #333;
	font-size: 18px;
}
</style>
