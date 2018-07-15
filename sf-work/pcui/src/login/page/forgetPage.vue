<template>
	<div class="w1100">
		<!--忘记密码-->
		<div class="login-box">
			<div class="login-title">{{$t('userlogin.forgotPassword')}}</div>
			<el-alert v-if="errorFlag" :title="errorMsg" type="error" show-icon :closable="false"></el-alert>
			<div class="forget-succ" v-if="submitFlag">
				<div class="forget-text-1">密码修改成功</div>
				<div class="forget-text-2">5s后系统将自动跳转到登录页面</div>
				<el-button class="login-submit" type="primary">马上去登录</el-button>
			</div>
			<div class="login-form" v-if="!submitFlag">
				<div class="login-form-item">
					<label>{{$t('userlogin.photoNumber')}}</label>
					<el-select class="login-select" v-model="forgetPwd.nMobile">
						<el-option v-for="item in nOptions" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
					<el-input class="login-input-1" :class="errorClass" v-model="forgetPwd.mobile" :placeholder="$t('userlogin.photoNumber')"
							  @change="checkMobile" tabindex="1"></el-input>
				</div>
				<div class="login-form-item">
					<label>{{$t('userlogin.smsVerifyCode')}}</label>
					<el-input class="login-input-2 login-input-4" v-model="forgetPwd.code"
							  :placeholder="$t('userlogin.verifyCode')" ref="codeinput" tabindex="2"></el-input>
					<el-button class="login-btn-2" type="text" @click="sendCode" :disabled="sending">{{sendMsg}}
					</el-button>
				</div>
				<div class="login-form-item">
					<label>{{$t('userlogin.newPassword')}}</label>
					<el-input class="login-input-2" v-model="forgetPwd.password" :placeholder="$t('userlogin.passWord')" type="password"
							  @change="checkPwd" tabindex="3"></el-input>
				</div>
				<div class="login-form-item">
					<label>{{$t('userlogin.retypePassword')}}</label>
					<el-input class="login-input-2" v-model="forgetPwd.rePassword" :placeholder="$t('userlogin.retypePassword')" type="password" 
						@keyup.enter.native="submit"  tabindex="4"></el-input>
				</div>
			</div>
			<el-button class="login-rbtn" type="text" @click="$router.push('/loginPage')">{{$t('userlogin.returnLogon')}}</el-button>
			<el-button v-if="!submitFlag" class="login-submit" type="primary" @click="submit" tabindex="5">{{$t('userlogin.confirm')}}</el-button>
		</div>
	</div>
</template>

<script>
	import {Message} from 'element-ui';
	export default {
		data() {
			return {
				// 是否提交成功
				submitFlag: false,
				// 国际区号列表
				nOptions: [{
					name: '+86',
					value: '+86'
				}],
				// 是否发送中
				sending: false,
				// 60秒倒计时
				countdown: 60,
				sendMsg: this.$t('userlogin.GettingSmsVerifyCode'),
				// 错误样式
				errorClass: '',
				// 表单对象
				forgetPwd: {
					nMobile: '+86',
					mobile: '',
					code: '',
					password: '',
					rePassword: '',
				},
				// 错误提示
				errorFlag: false,
				errorMsg: ''
			}
		},
		methods: {
			/* 校验手机号 */
			checkMobile(value) {
				const reg1 = /^[1][0-9]{10}$/;
				const reg2 = /^\d{0,}$/;
				let flag = false;
				if ((this.forgetPwd.nMobile === '+86' && !reg1.test(value))||(this.forgetPwd.nMobile !== '+86' && !reg2.test(value))){//号段号码验证
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
					this.errorMsg = '密码请输入6-16位数字字母组合'
				} else {
					this.errorFlag = false;
					this.errorMsg = '';
					flag = true
				}
				return flag
			},
			/* 获取短信验证码 */
			sendCode() {
				// 手机号校验
				if (!!this.ifAllNull('mobile',this.forgetPwd.mobile)||!this.checkMobile(this.forgetPwd.mobile)) {
					return false
				}
				this.$httpExt().get('VerifyCode',{
					'id':this.forgetPwd.mobile,
					'type':'msg',
					'subtype':'f'
				}).then(response => {
					this.$refs.codeinput.focus()
					this.sending = true
					this.sendMsg = this.countdown + 's'
					const timer = setInterval(() => {
						this.countdown--;
						this.sendMsg = this.countdown + 's后重新发送';
						if (this.countdown === 0) {
							this.sendMsg = this.$t('userlogin.GettingSmsVerifyCode')
							this.sending = false
							this.countdown = 120
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
					name: 'mobile',
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
				for (let [k, v] of Object.entries(this.forgetPwd)) {
					//非空校验
					if (this.ifAllNull(k, v)) {
						return false
					}
				}
				// 手机号校验
				if (!this.checkMobile(this.forgetPwd.mobile)) {
					return false
				}
				// 密码格式校验
				if (!(this.checkPwd(this.forgetPwd.password) && this.checkPwd(this.forgetPwd.rePassword))) {
					return false
				}
				// 两次密码是否一致
				if (this.forgetPwd.password !== this.forgetPwd.rePassword) {
					this.errorFlag = true;
					this.errorMsg = '两次密码输入不一致';
					return false
				}
				return true
			},
			/* 提交 */
			submit() {
				if (this.submitValid()) {
					var that=this;
					this.$httpExt().get('admin/getBack',{
						'username':this.forgetPwd.mobile,
						'password':this.$md5(this.forgetPwd.password),
						'key':this.forgetPwd.code,
						'verityType':'f'
					}).then(response => {
						Message({
							message: '找回密码成功，即将转入登录',
							type: 'success'
						});
						setTimeout(()=>{
							that.$router.push('/loginPage')
						},1200)
					}, response => {
						this.$notify.error({
							title: '异常',
							message: response.msg
						})
					})
					console.log('通过')
				}
			}
		}
	}
</script>

<style>

</style>
