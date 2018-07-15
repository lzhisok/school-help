<template>
	<el-row class="panel" :class="{'mini-menu': isMiniMenu}">
		<!-- 顶部区域 -->
		<el-col :span="24" class="panel-top">
			<el-col :span="8">
				<span class="logo"></span>
				<div class="logo">
					<img src="../../common/images/logo.png"/>
					<span>顺丰脸谱行动系统后台</span>
				</div>
			</el-col>
			<el-col :span="16">
				<span class="list" @click="logout">
					<i class="iconfont icon-logout"></i> {{$t('appMes.quit')}}</span>
				<span class="list" @click="dialogRole = true" v-if="roleLists.length">
					<i class="iconfont icon-role"></i> {{currentRoleName}}
				</span>
				<span class="list">
					Hi, {{userName}}
				</span>
				<span class="list" v-if="isI18N">
					<el-dropdown @command="handleCommand" class="language_title">
					    <span>
					        	{{$t('appMes.language')}}<i class="el-icon-arrow-down el-icon--right"></i>
					    </span>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item v-for="(item,index) in $t('appMes.languageList')" :command="item.value" :key="index">{{item.label}}</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</span>
			</el-col>
		</el-col>
		<el-col :span="24" class="panel-center">
			<!-- 左侧菜单栏 -->
			<aside class="main-menu">
				<el-menu class="menu" :collapse="isMiniMenu" unique-opened background-color="#324157" text-color="#bfcbd9">
					<submenu v-for="(item,index) in menu" :key="index" :item="item" @selected="selected" />
				</el-menu>
				<i class="el-icon-d-arrow-left menu-expand" @click="isMiniMenu = !isMiniMenu"></i>
			</aside>
			<!-- 主体内容区域 -->
			<section class="panel-container">
				<div class="grid-content">
					<el-tabs type="card" closable @tab-click="handleClick" @tab-remove="handleRemove" :active-name="tab" class="outer-tabs">
						<el-tab-pane v-for="(item, index) in tabs" :key="item.title" :label="item.title" :name="item.title" :data-index="index">
							<div :is="item.content" @page="createTab" :btns="item.btns"></div>
						</el-tab-pane>
					</el-tabs>
				</div>
			</section>
		</el-col>

		<el-dialog :title="$t('appMes.selectRole')" :visible.sync="dialogRole">
			<el-select v-model="currentRoleIdTemp" :placeholder="$t('appMes.selectRoles')" style="display:block">
				<el-option v-for="item in roleLists" :key="item.roleId" :label="item.roleName" :value="item.roleId">
					<span style="float: left">{{ item.roleName }}</span>
				</el-option>
			</el-select>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogRole = false">{{$t('appMes.cancelOption')}}</el-button>
				<el-button type="primary" @click="switchRole">{{$t('appMes.submitOption')}}</el-button>
			</span>
		</el-dialog>
	</el-row>
</template>

<script>
	import submenu from './submenu'
	const homePage = {
		title: window.sessionStorage.getItem('lang') == 'zh-CN' ? '内容管理' : 'contentManager',
		name: window.sessionStorage.getItem('lang') == 'zh-CN' ? '内容管理' : 'contentManager', //'首页',
		content: 'contentManager',
		btns: {}
	}

	export default {
		data() {
			return {
				tabs: [homePage],
				tab: window.sessionStorage.getItem('lang') == 'zh-CN' ? '内容管理' : 'contentManager', //'首页', //this.$t('appMes.homePageLang'), //'首页',
				menu: [],
				menuComponent: {
					'首页': 'homePage',
					'homePage': 'homePage', //添加
					'数据字典': 'dataDictionary',
					'角色列表': 'roleList',
					'用户列表': 'userList',
					'功能列表': 'functionList',
					'iframe模式打开': 'iframeContent',
					'静态资源列表': 'staticModuleList',
					"接口联调入口": "rapCompare", //模块太大，请按需放开
					'entrance of interface debug': 'rapCompare',
					'static resource list': 'staticModuleList',
					'data dictionary': 'dataDictionary',
					'role list': 'roleList',
					'user list': 'userList',
					'function list': 'functionList',
					'内容管理': 'contentManager',
					'报表查询': 'reportQuery',
					'海选视频审核': 'videoAudit',
					'官方宣传栏': 'officialVideo',
					'数据统计': 'statistics',
					'contentManager': 'contentManager',
					'reportQuery': 'reportQuery',
					'videoAudit': 'videoAudit',
					'statistics': 'statistics',
				},
				openedElement: [],
				roleLists: [],
				currentRoleIdTemp: '',
				dialogRole: false,
				isMiniMenu: false
			}
		},
		beforeCreate() {
			this.$httpExt().get('admin/checkLogin').then(response => {
				let data = response.result
				this.$store.commit('setUserName', data.userName)
				this.getRoles()
				/**初始化埋点 */
				SfGather.uid = data.userName
				SfGather.init()
				//手动上报事件  pc登陆
				this.$sfgather().addUserEvent('pc_login')
			}, response => {
				this.$notify.error({
					title: '异常',
					message: response.msg
				})
			})
		},
		computed: {
			isI18N() {
				return this.$store.state.global.i18nFlag
			},
			languageList() {
				if(window.sessionStorage.getItem('lang') == 'en-US') {
					return [{
							value: 'en-US',
							label: 'English'
						},
						{
							value: 'zh-CN',
							label: 'Chinese'
						}
					]
				}
				if(window.sessionStorage.getItem('lang') == 'zh-CN') {
					return [{
							value: 'en-US',
							label: '英文'
						},
						{
							value: 'zh-CN',
							label: '中文'
						}
					]
				}
			},
			currentRoleName() {
				for(let i = 0; i < this.roleLists.length; i++) {
					if(this.roleLists[i].roleId == this.currentRoleId)
						return this.roleLists[i].roleName
				}
			},
			userName() {
				return this.$store.state.global.userName
			},
			currentRoleId() {
				return this.$store.state.global.roleId
			}
		},
		methods: {
			handleCommand(command) {
				window.sessionStorage.setItem('lang', command);
				this.$i18n.locale = command;
				if(command == 'en-US') {
					window.sessionStorage.setItem('lang', 'en');
				} else {
					window.sessionStorage.setItem('lang', command);
				}
				window.location.reload();
			},
			searchId(data, str) {
				for(var i = 0; i < data.length; i++) {
					if(data[i].moduleName === str) {
						return data[i].moduleId
					} else if(data[i].childModules.length > 0) {
						var temp = this.searchId(data[i].childModules, str)
						if(temp) {
							return temp
						}
					}
				}
				return ''
			},
			queryBtns(moduleId, tabObjIntabs) {
				//根据moduleId获取按钮权限
				this.$httpExt().get('admin/queryPageBtn', {
					'moduleId': moduleId,
					'roleId': this.currentRoleId
				}).then(response => {
					var data = response
					if(data.result.length == 0) {
						return
					}
					var obj = {}
					for(let i = 0; i < data.result.length; i++) {
						obj[data.result[i]] = true
					}
					tabObjIntabs.btns = obj
				}, response => {
					this.$notify.error({
						title: '异常',
						message: response.msg
					})
				})
			},
			getRoles() {
				//根据userId获取角色列表
				this.$httpExt().get('admin/queryRoles').then(response => {
					var data = response
					if(data.result.length == 0) {
						return
					}
					this.roleLists = data.result
					//显示默认角色
					let hasDefault = false
					for(let i = 0; i < this.roleLists.length; i++) {
						if(this.roleLists[i].isDefault == 1) {
							this.$store.commit('setRoleId', this.roleLists[i].roleId)
							hasDefault = true
						}
					}
					//若没有默认角色，设置角色为第一个
					if(hasDefault == false) {
						this.$store.commit('setRoleId', this.roleLists[0].roleId)
					}

					this.currentRoleIdTemp = this.currentRoleId
					this.getMenu()
				}, response => {
					this.$notify.error({
						title: '异常',
						message: response.msg
					})
				})

			},
			switchRole() {
				this.$store.commit('setRoleId', this.currentRoleIdTemp)
				this.getMenu()
				this.dialogRole = false
				this.tabs = [homePage]
				this.tab = window.sessionStorage.getItem('lang') == 'zh-CN' ? '首页' : 'homePage' // this.$t('appMes.homePageLang') //'首页'
			},
			getQueryString(name) {
				var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
				var r = window.location.search.substr(1).match(reg)
				if(r != null) return r[2];
				return null
			},
			getMenu() {
				this.$httpExt().get('admin/queryMenus', {
					'roleId': this.currentRoleId
				}).then(response => {
					var data = response
					this.menu = data.result
					var page = decodeURI(this.getQueryString('p'))
					if(page !== 'null') {
						var moduleId = this.searchId(this.menu, page)
						moduleId && this.selected(page, moduleId)
					}
				}, respons => {
					this.$notify.error({
						title: '异常',
						message: response.msg
					})
				})
			},
			renderTab(h, tab) {
				return h('span', [
					`${tab.title} `,
					h('i', {
						class: ['el-icon-close']
					})
				])
			},
			selected(tab, moduleId) {
				/*对tab的切换进行埋点  当做是页面的跳转进行处理*/
				var pageName = tab + "_" + moduleId
				this.$sfgather().track_pageview(pageName)
				for(let [index, item] of this.tabs.entries()) {
					if(item.title == tab) {
						this.tab = tab
						return
					}
				}
				var content = this.menuComponent[tab]
				this.tabs.push({
					'title': tab,
					'name': tab,
					'content': content,
					'btns': {}
				})
				this.tab = tab
				this.queryBtns(moduleId, this.tabs[this.tabs.length - 1]) //查询新页面的按钮权限
			},
			handleClick(tab, event) {
				this.tab = tab.name
			},
			handleRemove(targetName) {
				let tabs = this.tabs
				let activeName = this.tab
				if(activeName === targetName) {
					tabs.forEach((tab, index) => {
						if(tab.name === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1]
							if(nextTab) {
								activeName = nextTab.name
							}
						}
					})
				}

				this.tab = activeName
				this.tabs = tabs.filter(tab => tab.name !== targetName)
			},
			over(event) {
				var panel = this.$el.querySelector(".panel-top").parentNode
				if(panel.className.indexOf('mini-menu') != -1) {
					event.currentTarget.querySelector(".el-menu").style.display = 'block'
				}
			},
			out(event) {
				var panel = this.$el.querySelector(".panel-top").parentNode
				if(panel.className.indexOf('mini-menu') != -1) {
					event.currentTarget.querySelector(".el-menu").style.display = 'none'
				}
			},
			logout() {
				this.$confirm(this.$t('appMes.quitContent'), this.$t('appMes.quitTips'), {
					confirmButtonText: this.$t('appMes.submitOption'),
					cancelButtonText: this.$t('appMes.cancelOption'),
					type: 'warning'
				}).then(() => {
					this.$httpExt().get('admin/logoutType').then(response => {
							var data = response
							this.$delAllCookie()
							if(data.result.falg==="C"){
								window.location.href = this.$store.state.global.url + 'admin/logout'
							}else{
								window.location.href = "/login/index.html";
							}
							
						}, respons => {
							this.$notify.error({
								title: '异常',
								message: respons.msg
							})
						})
				}).catch(() => {})
			},
			createTab(t, c) {
				let flag = false
				for(let [index, item] of this.tabs.entries()) {
					if(item.title == t) {
						this.tabs.splice(index, 1, {
							'title': t,
							'name': t,
							'content': c,
							'btns': {}
						})
						flag = true
						break
					}
				}
				if(!flag) {
					this.tabs.push({
						'title': t,
						'name': t,
						'content': c,
						'btns': {}
					})
				}
				this.tab = t
			}
		},
		components: {
			submenu,
			homePage: function(resolve) {
				require(['../homePage/homePage'], resolve)
			},
			dataDictionary: function(resolve) {
				require(['../backstageManage/dataDictionary'], resolve)
			},
			roleList: function(resolve) {
				require(['../userManage/roleList'], resolve)
			},
			userList: function(resolve) {
				require(['../userManage/userList'], resolve)
			},
			functionList: function(resolve) {
				require(['../userManage/functionList'], resolve)
			},
			iframeContent: function(resolve) {
				require(['../example/iframe'], resolve)
			},
			staticModuleList: function(resolve) {
				require(['../staticResource/staticModuleList'], resolve)
			},
			rapCompare: function(resolve) {
				require(['../tool/rapCompare'], resolve)
			},
			contentManager: function(resolve) { //内容管理
				require(['../contentManager/contentManager'], resolve)
			},
			reportQuery: function(resolve) { //报表查询
				require(['../reportQuery/reportQuery'], resolve)
			},
			videoAudit: function(resolve) { // 海选视频审核
				require(['../videoAudit/videoAudit'], resolve)
			},
			officialVideo: function(resolve) { // 官方赛事视频
				require(['../officialVideo/officialVideo'], resolve)
			},
			statistics: function(resolve) {  //数据统计
				require(['../statistics/statistics'], resolve) 
			},
		}
	}
</script>

<style scoped>
	.language_title {
		color: #c0ccda;
	}
</style>