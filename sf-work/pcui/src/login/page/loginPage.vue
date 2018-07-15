<template>
	<!--登录-->
	<div class="w1100">
		<div class="login-box">
			<div class="qr-btn" @click="qrVisible=!qrVisible"></div>
			<div v-if="qrVisible" class="qr-code">
				<div class="qr-code-title">{{$t('userlogin.scannedSecureLogin')}}</div>
				<img src="../../common/images/osfpCode.png"/>
			</div>
			<div v-else>
				<div class="login-title">{{$t('userlogin.loginTitle')}}</div>
				<el-alert v-if="errorFlag" :title="errorMsg" type="error" show-icon :closable="false"></el-alert>
				<div class="login-form">
					<div class="login-form-item">
						<label>{{$t('userlogin.photoNumber')}}</label>
						<el-input class="login-input-2" :class="errorClass" v-model="login.username" :placeholder="$t('userlogin.photoNumber')"
								  @change="checkMobile" tabindex="1"></el-input>
					</div>
					<div class="login-form-item">
						<label>{{$t('userlogin.passWord')}}</label>
						<el-input class="login-input-2" v-model="login.password" :placeholder="$t('userlogin.passWord')"
								  type="password" tabindex="2" @keyup.enter.native="submit"></el-input>
					</div>
					<div class="login-form-item">
						<label>{{$t('userlogin.verifyCode')}}</label>
						<div class="sf-code-warp" :class="{'sf-code-fail':sfcodefail,'sf-code-success':sfcodesuccess}" @mouseenter.stop="codeimgshow" @mouseleave.stop="codeimghide">
							<div v-show="!verifyPass" class="sf-code-panel" :class="{'sf-bgimg-show':isshow}">
								<div class="sf-panel-placeholder">
									<div class="sf-bgimg" id="sfcodeimg-box">
										<img class="sf-bg-img" style="border-radius: 2px" :src="codeimg" @click.stop="add_canvas($event)">
										<div v-if="!!pointgroup[index].m_clientX" :key="index" v-for="(item,index) in pointgroup" :class="'point-group point-group-'+index" :style="'left:'+item.m_clientX+'px;top:'+item.m_clientY+'px'"></div>
										<div class="sf-code-loadbox" v-show="loadIsShow">
											<div class="sf-code-loadbox-inner">
												<div class="sf-code-loadicon"></div>
												<span class="sf-code-loadtext">{{$t('userlogin.loading')}}</span>
											</div>
										</div>
									</div>
									<div class="sf-refresh" :title="$t('userlogin.refresh')" @click="refreshCode"></div>
								</div>
							</div>
							<div class="sf-code-control">
								<span class="sf-tips-icon"></span>
								<span class="sf-tips-text">{{codetxt}}</span>
							</div>
						</div>
					</div>
				</div>
				<el-button class="login-rbtn" type="text" @click="$router.push('/registerPage')">{{$t('userlogin.register')}}</el-button>
				<el-button class="login-rbtn" type="text" @click="$router.push('/forgetPage')">{{$t('userlogin.forgotPassword')}}</el-button>
				<el-button class="login-submit" type="primary" tabindex="4" @click="submit">{{$t('userlogin.signIn')}}</el-button>
			</div>
		</div>
	</div>
</template>

<script>
	import Vue from 'vue'
	export default {
		data() {
			return {
				// 错误样式
				errorClass: '',
				// 表单对象
				login: {
					username: '',
					password: ''
				},
				// 错误提示
				errorFlag: false,
				errorMsg: '',
				qrVisible:false,
				isshow:false,//验证码显示隐藏切换
				codeimg:'',//图片的base64
				codetxt:this.$t('userlogin.inGetting'),//验证码字符
				pointnum:1,//点击验证码标记数量
				codeLength:0,//验证码字符长度
				pointgroup:[{},{},{},{}],//点选的位子集合
				coordinate:'',//坐标值集合字符串
				loadIsShow:true,//loading层的显示标识
				sfcodesuccess:false,//验证码验证失败标识
				sfcodefail:false,//验证码验证成功标识
				verifyPass:false,//验证码是否验证通过
				showvalue:0
			}
		},
		mounted(){
			this.getImg()//初始化获取验证码
		},
		methods: {
			codeimgshow(){
				this.isshow=true
				this.showvalue=1
			},
			codeimghide(){
				this.showvalue=0
				setTimeout(()=>{
					if(this.showvalue!=1){
						this.isshow=false
					}
				},100)
				
				
			},
			/* 校验手机号 */
			checkMobile(value) {
				const reg1 = /^[1][0-9]{10}$/;
				let flag = false;
				 if (!reg1.test(value)) {//中国号段
					this.errorClass = 'input-error';
					this.errorFlag = true;
					this.errorMsg = this.$t('userlogin.phoneNumberWrong')
				} else {
					this.errorClass = '';
					this.errorFlag = false;
					this.errorMsg = '';
					flag = true
				}
				return flag
			},
			/* 校验验证码 */
			checkVerify() {
				let flag = false;
				if (!!this.verifyPass) {
					this.errorClass = '';
					this.errorFlag = false;
					this.errorMsg = '';
					flag = true
				} else {
					this.errorFlag = true;
					this.errorMsg = this.$t('userlogin.captchaFailed')
				}
				return flag
			},
			/* 判断表单是否有空 */
			ifAllNull(k, v) {
				let checkJson = [{
					name: 'username',
					text: '手机号'
				}, {
					name: 'password',
					text: '密码'
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
				for (let [k, v] of Object.entries(this.login)) {
					// 非空校验
					if (this.ifAllNull(k, v)) {
						return false
					}
				}
				// 手机号校验
				return this.checkMobile(this.login.username)&&this.checkVerify();
			},
			getCodeImg(id){//获取验证码图片
				let _this=this
				this.$httpExt().get('VerifyCode',{
					'id':id,
					'type':'pic'
				}).then(response => {
					this.sfcodefail=false
					this.sfcodesuccess=false
					let data = response.result
					this.codeimg='data:image/png;base64,'+data.pic
					this.codetxt=_this.$t('userlogin.turnClick')+'“'+data.chars.split("") + '”'
					this.codeLength=data.chars.length
					this.loadIsShow=false
				}, response => {
					this.sfcodefail=true
					this.sfcodesuccess=false
					this.codetxt='获取失败，请重试...'
				})
			},
			setCodeCookie(){//设置新的验证码cookie
				let myDate = new Date();
				let codeCookie=this.$md5(''+myDate.getTime()+Math.floor(Math.random()*10000))
				this.$setCookie('codekey',codeCookie,60*60)
			},
			getImg(){//通过接口拿图片URL
				this.setCodeCookie()
				this.getCodeImg(this.$getCookie("codekey"))
			},
			refreshCode(){//刷新验证码
				this.loadIsShow=true
				this.codetxt=this.$t('userlogin.inGetting')
				this.setCodeCookie()
				this.getCodeImg(this.$getCookie("codekey"))
				this.pointgroup=[{},{},{},{}]
				this.pointnum=1
				this.coordinate=''
			},
			add_canvas(ev){//绘制验证码
				if(this.pointnum<=this.codeLength){
					let imgLeft=document.getElementById('sfcodeimg-box').getBoundingClientRect().left,
					imgTop=document.getElementById('sfcodeimg-box').getBoundingClientRect().top;
	   				let m_clientX = parseInt(ev.clientX-imgLeft),
	   　　　　 		m_clientY = parseInt(ev.clientY-imgTop);
	   				this.coordinate+=(m_clientX+'_'+m_clientY+',')
	   				Vue.set(this.pointgroup[this.pointnum-1],"m_clientX",m_clientX-13)
	   				Vue.set(this.pointgroup[this.pointnum-1],"m_clientY",m_clientY-33)
	  				this.pointnum++
	  				if(this.pointnum>this.codeLength){
	  					this.codetxt='验证中，请稍等...'
	  					this.coordinate=this.coordinate.slice(0,this.coordinate.length-1)
	  					this.verifyCode(this.$getCookie("codekey"))
	  				}
				}
				
　　　　		},
			verifyCode(id){//验证验证码
				this.$httpExt().get('admin/verifyCode',{
					'reqid':id,
					'resultSet':this.coordinate
				}).then(response => {
					this.verifyPass=true
					this.sfcodesuccess=true
					this.codetxt=this.$t('userlogin.authenticationSuccess')
					this.sfcodefail=false
				}, response => {
					this.verifyPass=false
					this.sfcodefail=true
					this.sfcodesuccess=false
					this.codetxt=this.$t('userlogin.authenticationFailure')
					setTimeout(()=>{
						this.refreshCode()
						this.sfcodefail=false
					},1500)
				})
			},
			// TODO 等待接入APi
			submit() {//提交登陆
				if (this.submitValid()) {
					this.$httpExt().get('admin/login',{
						'username':this.login.username,
						'password':this.$md5(this.login.password),
						'verifykey':this.coordinate,
						'verifyid':this.$getCookie("codekey")
					}).then(response => {
						let data = response
						/**初始化埋点 */
						SfGather.uid = data.userName//手动上报事件  pc登陆
						SfGather.init()
						this.$sfgather().addUserEvent('pc_login')
					}, response => {
						this.verifyPass=false
						this.refreshCode()
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
