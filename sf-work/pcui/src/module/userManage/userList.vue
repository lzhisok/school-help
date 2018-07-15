<template>
	<el-row class="userList">
		<el-col :span="24">
			<el-form label-position="left" :inline="true" ref="conditionForm" :model="conditionForm" label-width="80px" class="userList-searchform">
				<el-form-item :label="$t('userListLang.inusername')">
					<el-input v-model="conditionForm.username"></el-input>
				</el-form-item>
				<el-form-item :label="$t('userListLang.userAuthorityRoleName')">
					<el-select v-model="conditionForm.valueRoLeList" multiple :placeholder="$t('userListLang.pleaseChoose')" @remove-tag="removeValueRoleList">
						<el-option v-for="item in tableRoleData" :key="item.roleId" :label="item.roleName" :value="item.roleId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('userListLang.userType')">
					<el-select v-model="conditionForm.typeCode" :placeholder="'==='+$t('userListLang.pleaseChoose')+'==='" clearable>
						<el-option :label="$t('userListLang.domain')" value="1"></el-option>
						<el-option :label="$t('userListLang.Ndomain')" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('userListLang.state')">
					<el-select v-model="conditionForm.status" :placeholder="'==='+$t('userListLang.pleaseChoose')+'==='" clearable>
						<el-option :label="$t('userListLang.effective')" value="1"></el-option>
						<el-option :label="$t('userListLang.invalid')" value="0"></el-option>
					</el-select>
				</el-form-item>

				<el-button type="primary" @click="queryData">{{$t('userListLang.search')}}</el-button>
			</el-form>
			<div class="grid-content">
				<div class="">
					<el-button @click="add" type="primary" size="small" icon="plus">{{$t('userListLang.addOption')}}</el-button>
					<!--<el-button @click="modifyData" type="primary" size="small" icon="edit">修改</el-button>-->
					<el-button @click="deleteData" type="primary" size="small" icon="delete">{{$t('userListLang.deleteOption')}}</el-button>
					<el-button @click="empower" type="primary" size="small"><i class="el-icon-information"></i>&nbsp;{{$t('userListLang.authority')}}</el-button>
					<el-button @click="enaDeletebleUser" type="primary" size="small"><i class="el-icon-caret-right" icon="delete"></i>&nbsp;{{$t('userListLang.deleteRole')}}</el-button>
					<el-button @click="enableUser" type="primary" size="small"><i class="el-icon-caret-right"></i>&nbsp;{{$t('userListLang.startOpen')}}</el-button>
					<el-button @click="disableUser" type="primary" size="small"><i class="el-icon-time"></i> &nbsp;{{$t('userListLang.stopUse')}}</el-button>
				</div>

				<div class="data-list">
					<el-table :data="tableData" border style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
						<el-table-column width="38">
							<template slot-scope="scope">
								<label class="radio">
									<input type="radio" value="2" name="radio" :data-index="scope.$index">
									<span class="dot"></span>
								</label>
							</template>
						</el-table-column>
						<el-table-column :label="$t('userListLang.inusername')" prop="username" width="120">
						</el-table-column>
						<el-table-column prop="typeCode" :formatter="formatterType" :label="$t('userListLang.userType')" width="130">
						</el-table-column>
						<el-table-column prop="roleList" :formatter="formatterRoles" :label="$t('userListLang.hasRoles')" width="130">
						</el-table-column>
						<el-table-column prop="state" :formatter="formatterState" :label="$t('userListLang.state')" width="80">
						</el-table-column>
						<el-table-column prop="activeTm" :label="$t('userListLang.activationTime')" width="120">
							<template slot-scope="scope">
								{{scope.row.activeTm?scope.row.activeTm.substring(0, 10):''}}
							</template>
						</el-table-column>
						<el-table-column prop="deactiveTm" :label="$t('userListLang.stopDTime')" width="120">
							<template slot-scope="scope">
								{{scope.row.deactiveTm?scope.row.deactiveTm.substring(0, 10):''}}
							</template>
						</el-table-column>
						<el-table-column prop="modifierUser" :label="$t('userListLang.modifiedBy')" width="100">
						</el-table-column>
						<el-table-column prop="modifyTm" :label="$t('userListLang.modifiedTime')" width="120">
							<template slot-scope="scope">
								{{scope.row.modifyTm?scope.row.modifyTm.substring(0, 10):''}}
							</template>
						</el-table-column>
						<el-table-column prop="creatorUser" :label="$t('userListLang.createBy')">
						</el-table-column>
						<el-table-column prop="createTm" :label="$t('userListLang.createTime')" width="130">
							<template slot-scope="scope">
								{{scope.row.createTm?scope.row.createTm.substring(0, 10):''}}
							</template>
						</el-table-column>

					</el-table>

					<el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10,20, 50, 100]" :page-size="pageSize" layout="->,prev, pager, next, jumper, sizes,total" :total="totalSize">
					</el-pagination>
				</div>
			</div>
		</el-col>

		<!--新增和修改用户-->
		<el-dialog :title="$t('userListLang.userTitle')" :visible.sync="addAndModifyUser" width="25%">
			<el-form :model="userForm" :rules="rules" ref="userForm">

				<el-input type="hidden" v-model="userForm.userId"></el-input>

				<el-form-item :label="$t('userListLang.userType')" :label-width="formLabelWidth">
					<el-select v-model="userForm.typeCode" :disabled="disabled">
						<el-option :label="$t('userListLang.domain')" value="1"></el-option>
						<el-option :label="$t('userListLang.Ndomain')" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item prop="username" :label="$t('userListLang.inusername')" :label-width="formLabelWidth">
					<el-input :disabled="disabled" :placeholder="userForm.typeCode==1?$t('userListLang.placeholderTipOne'):$t('userListLang.placeholderTipTwo')" v-model="userForm.username" auto-complete="off"></el-input>
				</el-form-item>
				<!--用户名称英文-->
				<!--<el-form-item prop="username" :label="$t('userListLang.eninusername')" :label-width="formLabelWidth" v-if="userForm.typeCode==0">
					<el-input :disabled="disabled" :placeholder="userForm.typeCode==1?$t('userListLang.placeholderTipOne'):$t('userListLang.placeholderTipTwo')" v-model="userForm.enusername" auto-complete="off"></el-input>
				</el-form-item>-->

				<el-form-item prop="pwd" :label="$t('userListLang.inPwd')" v-if="isShow" :label-width="formLabelWidth">
					<el-input v-model="userForm.pwd" type="password" auto-complete="off"></el-input>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">{{$t('userListLang.cancelOption')}}</el-button>
				<el-button type="primary" @click="submitForm('userForm')">{{$t('userListLang.submitOption')}}</el-button>
			</div>
		</el-dialog>

		<!--授权-->
		<el-dialog :title="$t('userListLang.userAuthority')" :visible.sync="dialogEmpower" width="85%">
			<el-row>
				<el-col :span="11">
					<el-table :data="roleData" border style="width: 100%" @selection-change="handleSelectionChange">
						<el-table-column type="selection" width="55">
						</el-table-column>
						<el-table-column prop="roleCode" :label="$t('userListLang.userAuthorityName')">

						</el-table-column>
						<el-table-column prop="roleName" :label="$t('userListLang.userAuthorityType')">
						</el-table-column>

					</el-table>
				</el-col>
				<el-col :span="2">
					<div class="move-wrap">
						<div class="moveRight" @click="moveRight"><i class="el-icon-d-arrow-right"></i></div>
						<div class="moveLeft" @click="moveLeft"><i class="el-icon-d-arrow-left"></i></div>
					</div>

				</el-col>

				<el-col :span="11">
					<el-table :data="hasRoleData" border style="width: 100%" highlight-current-row @selection-change="hasRoleDataChange">
						<el-table-column type="selection">
						</el-table-column>
						<el-table-column prop="roleName" width="130" :label="$t('userListLang.userAuthorityRoleName')">
						</el-table-column>

						<el-table-column width="50" :label="$t('userListLang.userAuthorityDefault')">
							<template slot-scope="scope">
								<div class="roleRadio">
									<el-radio class="radio" :label="scope.row.roleId" @click.native="checkDefaultRole(scope.row.roleId)" name="radio" v-model="roleModel"></el-radio>
								</div>
							</template>
						</el-table-column>
						<el-table-column prop="expDate" :label="$t('userListLang.userAuthorityValidity')">
							<template slot-scope="scope">
								<el-date-picker v-model="scope.row.expDate" type="date" :placeholder="$t('userListLang.selectDate')" :picker-options="pickerOptions">
								</el-date-picker>
							</template>
						</el-table-column>

					</el-table>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogEmpower = false">{{$t('userListLang.cancelOption')}}</el-button>
				<el-button type="primary" @click="saveRoleData">{{$t('userListLang.saveOption')}}</el-button>
			</div>
		</el-dialog>

	</el-row>

</template>

<script>
	import { Message, Notification } from 'element-ui';

	export default {
		data() {

			var vUsername = (rule, value, callback) => {
				if(this.userForm.typeCode == 1) {
					if(!(/(^\d{6}$)|(^\d{8}$)/.test(value))) {
						callback(new Error(this.$t('userListLang.placeholderTipOne')));
					} else {
						callback();
					}
				} else {
					if(value.length >= 48) {
						callback(new Error(this.$t('userListLang.placeholderTipTwo')));
					} else {
						callback();
					}
				}
			};
			var vPwd = (rule, value, callback) => {
				if(value === '') {
					callback(new Error(this.$t('userListLang.testPwdOne')));
				} else if(/[ ]/.test(value)) {
					callback(new Error(this.$t('userListLang.testPwdTwo')));
				} else if(!(/[a-z]/.test(value))) {
					callback(new Error(this.$t('userListLang.testPwdThere')));
				} else if(!(/[A-Z]/.test(value))) {
					callback(new Error(this.$t('userListLang.testPwdFour')));
				} else if(!(/\d/.test(value))) {
					callback(new Error(this.$t('userListLang.testPwdFive')));
				} else if(!(/[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/.test(value))) {
					callback(new Error(this.$t('userListLang.testPwdSix')));
				} else if(!(value.length >= 6 && value.length <= 24)) {
					callback(new Error(this.$t('userListLang.testPwdSeven')));
				} else {
					callback();
				}
			};

			return {
				conditionForm: {
					typeCode: '',
					username: '',
					status: '',
					valueRoLeList: []
				},
				pickerOptions: {
					disabledDate(time) {
						return time.getTime() < Date.now() - 8.64e7;
					}
				},
				userForm: {
					userId: '',
					typeCode: '1',
					username: '',
					//enusername: '',
					pwd: '',
					pwdModifyTm: '',
					status: 1,
					activeTm: '',
					deactiveTm: '',
					modifierUser: '',
					modifyTm: '',
					creatorUser: '',
					createTm: ''
				},
				tableRoleData: [],
				tableData: [],
				roleData: [],
				hasRoleData: [],
				currentRow: null,
				addAndModifyUser: false,
				dialogEmpower: false,
				formLabelWidth: '100px',
				multipleSelection: [],
				hasRoleSelection: [],
				roleModel: '',
				regions: [{
					'name': 'region1',
					'icon': '444'
				}, {
					'name': 'region2'
				}],
				props: {
					label: 'name',
					children: 'zones'
				},
				title: '新增用户',
				isShow: false,
				disabled: false,
				pageSize: 10,
				start: 0,
				totalSize: 0,
				currentPage: 1,
				userId: '',
				defaultRole: '',
				rules: {
					username: [{
						required: true,
						message: this.$t('userListLang.chooseType'),
					}, {
						validator: vUsername,
						trigger: 'blur'
					}],
					pwd: [{
						validator: vPwd,
						trigger: 'blur'
					}]

				},
			}
		},
		methods: {
			getPageData() {
				var valueRoleIds = '';
				for(var i = 0; i < this.conditionForm.valueRoLeList.length; i++) {
					valueRoleIds += this.conditionForm.valueRoLeList[i] + ",";
				}
				var param = {
					typeCode: this.conditionForm.typeCode,
					username: this.conditionForm.username,
					valueRoleIds: valueRoleIds,
					status: this.conditionForm.status,
					pageSize: this.pageSize,
					start: this.start
				}
				this.$httpExt().get('tsUser/userData',
					param
				).then((response) => {
					var result = response.result
					this.totalSize = result.totalSize
					var data = result.rows
					this.pageSize = result.pageSize
					this.currentPage = result.currentPage
					this.tableData = data
				}, (response) => {
					Notification.error({
						title: '异常',
						message: response.msg
					})
				});
			},
			queryData() {
				this.getPageData(this.conditionForm);
			},
			handleCurrentChange(val) {
				if(!val) {
					return
				}
				var that = this
				this.currentRow = val;
				this.userId = val.userId
				setTimeout(function() {
					if(that.$el.querySelector("tr.current-row")) {
						var current = that.$el.querySelector("tr.current-row").querySelector("input[type=radio]")
						that.index = current.dataset.index
					}
				}, 30)
			},
			add() {

				this.title = '新增用户'
				this.addAndModifyUser = true
				this.disabled = false
				this.userForm.username = ""
				this.isShow = false

			},
			deleteData() {
				if(this.index) {
					this.$confirm(this.$t('userListLang.deleteThisRole'), this.$t('userListLang.tips'), {
						confirmButtonText: this.$t('userListLang.submitOption'),
						cancelButtonText: this.$t('userListLang.cancelOption'),
						type: 'warning'
					}).then(() => {
						this.$httpExt().get('tsUser/deleteByPrimaryKey', {
							'userId': this.userId,
						}).then((response) => {
							var body = response
							this.tableData.splice(this.index, 1);
							this.index = ''
							Message({
								message: this.$t('userListLang.deleteSucc'),
								type: 'success'
							});
						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							})
						})

					}).catch(() => {

					});
				} else {
					Message({
						message: this.$t('userListLang.selectOptions'),
						type: 'warning'
					});
				}

			},
			submitForm(form) {
				if(this.userForm.userId === "" || this.userForm.userId === null) {
					this.$refs[form].validate((valid) => {
						if(valid) {
							this.saveUser()
						} else {
							return false;
						}
					});
				} else {
					this.saveUser()
				}

			},
			saveUser() {
				let params = "userId=" + this.userForm.userId + "&username=" + this.userForm.username + "&typeCode=" + this.userForm.typeCode + "&pwd=" + this.userForm.pwd + "&pwdModifyTm=" + this.userForm.pwdModifyTm + "&status=" + this.userForm.status;
				params += "&activeTm=" + this.userForm.activeTm + "&deactiveTm=" + this.userForm.deactiveTm + "&modifierUser=" + this.userForm.modifierUser + "&modifyTm=" + this.userForm.modityTm + "&creatorUser=" + this.userForm.creatorUser + "&createTm=" + this.userForm.createTm;
				this.$httpExt().get('tsUser/saveUser',
					this.userForm
				).then((response) => {
					Message({
						message: this.$t('userListLang.saveSucc'),
						type: 'success'
					});
					this.queryData();
				}, (response) => {
					Notification.error({
						title: '异常',
						message: response.msg
					})
				});

				this.addAndModifyUser = false
			},
			cancel() {
				this.$refs.userForm.resetFields()
				this.addAndModifyUser = false

			},
			formatterType(row, column) {
				return row.typeCode == '1' ? this.$t('userListLang.domain') : this.$t('userListLang.Ndomain');
			},
			formatterState(row, column) {
				return row.status == true ? this.$t('userListLang.effective') : this.$t('userListLang.invalid');
			},
			formatterRoles(row, column) {
				var rows = row.roles;
				if(rows.length == 0) {
					return "";
				}
				var roleNames = [];
				for(let i in rows) {
					roleNames[i] = rows[i].roleName;
				}
				return roleNames.join(",");
			},
			empower() {
				if(this.index) {
					this.dialogEmpower = true;
					this.getAllRoleData(); //获取所有角色列表
					this.getHasRoleData(); //获取已有角色列表
				} else {
					Message({
						message: this.$t('userListLang.selectOptions'),
						type: 'warning'
					});
				}
			},
			getAllRoleData() {
				this.$httpExt().get('roleManage/roleData')
					.then((response) => {
						var body = response.result
						var data = body.rows
						if(data.length != 0) {
							data.forEach(function(sub, index) {
								if(sub) {
									sub.expDate = ''
								}
								if(sub.roleCode != "" && sub.roleName != "") {
									sub.roleCode = sub.roleCode + "/" + sub.roleName
								}

							})
						}

						this.roleData = data
					}, (response) => {
						Notification.error({
							title: '异常',
							message: response.msg
						})
					});
			},
			getHasRoleData() {
				this.$httpExt().get('tsUser/selectByPrimaryKey', {
					'userId': this.userId
				}).then((response) => {

					let that = this

					var body = response
					var data = body.result.tsUserRoles
					if(data.length != 0) {
						data.forEach(function(sub, index) {
							if(!sub.expDate) {
								sub.expDate = ''
							}
							if(sub.roleCode != "" && sub.roleName != "") {
								sub.roleCode = sub.roleCode + "/" + sub.roleName
							}
							if(sub.isDefault) {
								that.roleModel = sub.roleId
							}

						})
					}

					this.hasRoleData = data

				}, (response) => {
					Notification.error({
						title: '异常',
						message: response.msg
					})
				});
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			hasRoleDataChange(val) {
				this.hasRoleSelection = val;
			},
			tableHttp() {
				var param = {};

				/*
				 * this.index = -1;param.roleName = this.form.roleName;
					param.roleType = this.form.roleType;*/
				param.pageSize = 100;
				param.currentPage = this.currentPage;
				if(!param.hasOwnProperty("start")) {
					param.start = 0
				}
				this.$httpExt().get('roleManage/roleData', param)
					.then((response) => {
						var body = response.result
						/*	this.pageSize = body.pageSize
							this.totalSize = body.totalSize*/
						this.tableRoleData = body.rows;
					}, (response) => {
						Notification.error({
							title: '异常',
							message: response.msg
						});
					});
			},
			removeValueRoleList() {
				this.getPageData(this.conditionForm);
			},
			moveRight() {
				this.roleModel = ''
				for(let hindex in this.hasRoleData) {
					for(let mindex in this.multipleSelection) {

						//flag 此处判断对象是否相等有bug,有接口之后应该判断角色ID是否相等
						if(this.multipleSelection[mindex].roleId === this.hasRoleData[hindex].roleId) {

							Message({
								message: this.$t('userListLang.existRole') + this.multipleSelection[mindex].roleName + this.$t('userListLang.playRole'),
								type: 'warning'
							});
							this.multipleSelection.splice(mindex, 1)
						}

					}

				}
				let joinArray = this.hasRoleData.concat(this.multipleSelection);

				this.hasRoleData = joinArray;

			},
			moveLeft() {
				let roleData = this.hasRoleData
				let roleSelect = this.hasRoleSelection
				for(var hindex = 0; hindex < roleData.length; hindex++) {
					for(var sindex = 0; sindex < roleSelect.length; sindex++) {
						if(roleData[hindex] != undefined) {
							if(roleSelect[sindex].roleId == roleData[hindex].roleId) {
								//删除之后原有下标改变
								roleData.splice(hindex--, 1)
							}
						}
					}
				}
			},
			checkDefaultRole(roleId) {
				this.defaultRole = roleId
			},
			saveRoleData() {
				let that = this
				let hrd = this.hasRoleData
				let params = 'userId=' + this.userId
				if(this.defaultRole != '') {
					params += '&defaultRole=' + this.defaultRole
				}
				hrd.forEach(function(sub) {
					if(sub.expDate == undefined || sub.expDate == '') {
						sub.expDate = ''
						params += '&roleId=' + sub.roleId + '&expDate='
					} else {
						params += '&roleId=' + sub.roleId + '&expDate=' + that.formatDateToString(sub.expDate)
					}

				})

				this.$httpExt().get('tsUserRole/saveUserRole?' + params)
					.then((response) => {
						Message({
							message: response.msg,
							type: 'success'
						});
						setTimeout(() => {
							this.dialogEmpower = false;
						}, 1000);
						this.queryData();
					}, (response) => {
						Notification.error({
							title: '异常',
							message: response.msg
						})
					});
				this.addAndModifyUser = false
			},
			sizeChange(val) {
				this.pageSize = val;
				this.getPageData();
			},
			currentChange(val) {
				this.start = (val - 1) * this.pageSize
				this.getPageData();
			},
			enaDeletebleUser() {
				console.log(this.index);
				if(this.index) {
					this.$confirm(this.$t('userListLang.deleteAllRole'), this.$t('userListLang.tips'), {
						confirmButtonText: this.$t('userListLang.submitOption'),
						cancelButtonText: this.$t('userListLang.cancelOption'),
						type: 'warning'
					}).then(() => {
						this.$httpExt().get('tsUser/menuUserAuthority', {
							'userId': this.userId,
						}).then((response) => {

							Message({
								message: this.$t('userListLang.deleteSucc'),
								type: 'success'
							});
							this.getPageData(this.conditionForm);
						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							})
						})

					}).catch(() => {

					});

				} else {
					Message({
						message: this.$t('userListLang.selectOptions'),
						type: 'warning'
					});
				}

			},
			enableUser() {
				if(this.currentRow.status == 1) {
					Message({
						message: this.$t('userListLang.userStateStart'),
						type: 'warning'
					});
					return
				}
				if(this.index) {
					this.$httpExt().get('tsUser/enableUser', {
							'userId': this.userId
						})
						.then((response) => {

							var body = response

							Message({
								message: response.msg,
								type: 'success'
							});
							this.getPageData()
							this.index = ''

						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							})
						});
				} else {
					Message({
						message: this.$t('userListLang.selectOptions'),
						type: 'warning'
					});
				}

			},
			disableUser() {
				if(this.currentRow.status == 0) {
					Message({
						message: this.$t('userListLang.userStateStop'),
						type: 'warning'
					});
					return
				}
				if(this.index) {
					this.$httpExt().get('tsUser/disableUser', {
							'userId': this.userId
						})
						.then((response) => {
							var body = response

							Message({
								message: response.msg,
								type: 'success'
							});
							this.getPageData()
							this.index = ''

						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							})
						});
				} else {
					Message({
						message: this.$t('userListLang.selectOptions'),
						type: 'warning'
					});
				}
			},
			formatDateToString(date) {

				if(typeof date == 'object') {
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var day = date.getDate();
					if(month < 10) month = "0" + month;
					if(day < 10) day = "0" + day;
					return year + '-' + month + '-' + day;
				} else if(typeof date == 'string') {
					return date.substring(0, 10)
				}

			}

		},
		mounted() {
			this.tableHttp();
			this.getPageData();
		}
	}
</script>

<style lang="less">
	.roleRadio {
		width: 24px;
		overflow: hidden;
		padding: 7px;
	}
	
	.userList-searchform {
		.el-form-item__content {
			width: 200px;
			.el-select,
			.el-input {
				width: 100%;
			}
		}
	}
</style>