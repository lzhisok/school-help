<template>
	<div class="roleList">
		<el-form :inline="true" :model="form" ref="form" label-width="90px">
			<el-form-item :label="$t('roleLang.roleName') + ':'">
				<el-input v-model="form.roleName" :placeholder="$t('roleLang.roleName')"></el-input>
			</el-form-item>
			<el-form-item :label="$t('roleLang.roleType')+':'">
				<el-select v-model="form.roleType" :placeholder="$t('roleLang.pleaseChoose')" clearable>
					<el-option v-for="(item,index) in roleTypesDic" :key="index" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>

			<el-button type="primary" @click="onSubmit">{{$t('roleLang.search')}}</el-button>
		</el-form>

		<div class="">
			<el-button type="primary" size="small" icon="plus" @click="add">{{$t('roleLang.addOption')}}</el-button>
			<el-button type="primary" size="small" icon="edit" @click="modify">{{$t('roleLang.editOption')}}</el-button>
			<el-button type="primary" size="small" icon="delete" @click="deleteRow">{{$t('roleLang.deleteOption')}}</el-button>
			<el-button type="primary" size="small" icon="search" @click="authorization">{{$t('roleLang.authority')}}</el-button>
		</div>
		<el-table :data="tableData" border style="width: 100%" class="data-list" highlight-current-row @current-change="handleCurrentChange">
			<el-table-column width="38">
				<template slot-scope="scope">
					<label class="radio">
						<input type="radio" value="2" name="radio" :data-index="scope.row.index">
						<span class="dot"></span>
					</label>
				</template>
			</el-table-column>
			<el-table-column prop="roleCode" :label="$t('roleLang.roleCode')"></el-table-column>
			<el-table-column prop="roleName" :label="$t('roleLang.roleName')"></el-table-column>
			<el-table-column prop="roleType" :label="$t('roleLang.roleType')">
				<template slot-scope="scope">
					{{$dicTool().getValName('BaseSetting.RoleTypes',String(scope.row.roleType))}}
				</template>
			</el-table-column>
			<el-table-column prop="roleDesc" :label="$t('roleLang.roleDescription')"  show-overflow-tooltip>
			</el-table-column>
			<el-table-column prop="modifyTm" :label="$t('roleLang.editTime')">
				<template slot-scope="scope">
					{{$format((new Date(scope.row.modifyTm)).getTime(),'yyyy-MM-dd hh:mm')}}
				</template>
			</el-table-column>
			<el-table-column prop="status" :label="$t('roleLang.state')">
				<template slot-scope="scope">
					{{scope.row.status=='1' ? $t('roleLang.effective'): $t('roleLang.invalid')}}
				</template>
			</el-table-column>
		</el-table>
		<el-pagination @size-change="sizeChange" @current-change="currentChange" 
			:current-page="currentPage" 
			:page-sizes="[10,20,50,100, 200, 300, 400]" 
			:page-size="pageSize" 
			layout="->,prev, pager, next, jumper, sizes,total" 
			:total="totalSize">
		</el-pagination>

		<el-dialog :title="$t('roleLang.roleTitle')" :visible.sync="newlyFormVisible" width="30%" @close="close" @open="open">
			<el-form :model="newlyForm" ref="newlyForm" label-width="150px" :rules="rules">
				<el-form-item :label="$t('roleLang.roleCode')" prop="encoding">
					<el-input v-model="newlyForm.encoding"></el-input>
				</el-form-item>
				<el-form-item :label="$t('roleLang.roleName')" prop="name">
					<el-input v-model="newlyForm.name"></el-input>
				</el-form-item>
				<el-form-item :label="$t('roleLang.roleType')" prop="type">
					<el-select v-model="newlyForm.type">
						<el-option v-for="(item,index) in roleTypesDic" :key="index" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('roleLang.isEffective')" prop="status">
					<el-select v-model="newlyForm.status">
						<el-option :label="$t('roleLang.effective')" value="1"></el-option>
						<el-option :label="$t('roleLang.invalid')" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('roleLang.roleDescription')" prop="roleDesc">
					<el-input type="textarea" v-model="newlyForm.roleDesc"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleReset">{{$t('roleLang.cancelOption')}}</el-button>
				<el-button type="primary" @click="handleSubmit">{{$t('roleLang.submitOption')}}</el-button>
			</div>
		</el-dialog>

		<el-dialog :title="$t('roleLang.roleAuthority')" :visible.sync="authorizationVisible" width="30%">
			<el-tree show-checkbox :data="authorizationData" :props="defaultProps" @node-click="handleNodeClick" ref="tree" @check-change="check" node-key="module_id" :default-checked-keys="checked" :default-expanded-keys="expanded">

			</el-tree>

			<div slot="footer" class="dialog-footer">
				<el-button size="small" @click="authorizationClose">{{$t('roleLang.closeOption')}}</el-button>
				<el-button type="primary" size="small" @click="authorizationSave">{{$t('roleLang.saveOption')}}</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	import {
		Message
	} from 'element-ui';
	import {
		Notification
	} from 'element-ui';
	export default {
		data() {
				var encoding = (rule, value, callback) => {
					if(value === '') {
						callback(new Error(this.$t('roleLang.roleChartset')));
					} else if(!(/^\w{1,30}$/.test(value))) {
						callback(new Error($t('roleLang.inputTest')));
					} else {
						callback();
					}
				};
				return {
					authorizationData: [],
					defaultProps: {
						children: 'nodes',
						label: 'text'
					},
					form: {
						roleName: '',
						roleType: ''
					},
					newlyForm: {
						encoding: '',
						name: '',
//						enroleName: '', //英文名称
						type: '',
						status: 1,
						roleDesc:''
					},
					modifyForm: {

					},
					rules: {
						encoding: [{
							validator: encoding,
							required: true,
							trigger: 'blur'
						}],
						name: [{
							required: true,
							message: this.$t('roleLang.inputRoleName'),
							trigger: 'blur'
						}, {
							min: 1,
							max: 50,
							message: this.$t('roleLang.roleNameLimit'),
							trigger: 'blur'
						}],
						type: [{
							required: true,
							message: this.$t('roleLang.chooseRoleType'),
							trigger: 'change'
						}],
						status: [{
							required: true,
							message: this.$t('roleLang.chooseIsavaild'),
							trigger: 'change'
						}],
					},
					tableData: [],
					currentRow: null,
					newlyFormVisible: false,
					authorizationVisible: false,
					index: -1,
					dialogTitle: "新增角色",
					pageSize: 10,
					start:0,
					currentPage:1,
					totalSize: 0,
					roleId: 1,
					checked: [],
					expanded:[],
					roleTypesDic:[],
				}
			},
			mounted() {
				this.tableHttp();
				/*角色类型*/
				this.roleTypesDic = this.$dicTool().getSeletList('BaseSetting.RoleTypes');
			},
			methods: {
				tableHttp() {
					let param= {
						roleName: this.form.roleName,
						roleType: this.form.roleType,
						pageSize:this.pageSize,
						start:this.start
					}
					this.$httpExt().get('roleManage/roleData', param)
						.then((response) => {
							var body = response.result
							this.pageSize = body.pageSize
							this.totalSize = body.totalSize
							var rows = body.rows
							for(let [index, item] of rows.entries()){
								item.index = index
							}
							this.tableData = rows
						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							});
						});
				},
				authorizationHttp() {
					this.$httpExt().get('module/queryListByRoleIdForGrant', {
						'roleId': this.roleId
					}).then((response) => {
						var body = response.result
						this.checked = body.pop().checkedIDs
						this.authorizationData = body
						this.expanded = []
						this.expanded.push(body[0].module_id)
					}, (response) => {
						Notification.error({
							title: '异常',
							message: response.msg
						});
					})
				},
				onSubmit(response) {
					this.tableHttp(this.form)
				},
				handleCurrentChange(val) {
					if(!val) {
						return
					}
					this.roleId = val.roleId
					this.index = val.index+''
				},
				add() {
					this.dialogTitle = "新增角色"
					this.newlyForm = {
						encoding: '',
						name: '',
						type: '',
						status: '1',
						roleDesc:'',
					}
					this.newlyFormVisible = true 
				},
				modify() {
					if(this.index >= 0) {
						this.$httpExt().get('roleManage/selectByPrimaryKey', {
							'roleId': this.roleId
						}).then((response) => {
							var body = response.result
							body.sysFlag = body.sysFlag || "0"
							var currentRowData = {
								encoding: body.roleCode,
								name: body.roleName,
								type: body.roleType+'',
								status: body.status+'',
								sysFlag: body.sysFlag,
								roleDesc: body.roleDesc
							}
							this.newlyForm = currentRowData
							this.dialogTitle = "修改角色"
							this.currentRow = body
							this.newlyFormVisible = true

						}, (response) => {
							Notification.error({
								title: '异常',
								message: response.msg
							});
						})

					} else {
						Message({
							message: this.$t('roleLang.selectOptions'),
							type: 'warning'
						});
					}
				},
				deleteRow() {
					if(this.index >= 0) {
						this.$confirm(this.$t('roleLang.selectOptions'), this.$t('roleLang.tips'), {
							confirmButtonText: this.$t('roleLang.submitOption'),
							cancelButtonText: this.$t('roleLang.cancelOption'),
							type: 'warning'
						}).then(() => {
							this.$httpExt().get('roleManage/deleteByPrimaryKey', {
								'roleId': this.roleId
							}).then((response) => {
								var body = response.result
								this.tableData.splice(this.index, 1);
								this.index = -1
								Message({
									message: this.$t('roleLang.deleteSucc'),
									type: 'success'
								});
								this.tableHttp();
							}, (response) => {
								Notification.error({
									title: '异常',
									message: response.msg
								});
							})
						}).catch(() => {

						});
					} else {
						Message({
							message: this.$t('roleLang.selectOptions'),
							type: 'warning'
						});
					}

				},
				authorization() {
					if(this.index >= 0) {
						this.authorizationHttp()
						this.authorizationVisible = true
					} else {
						Message({
							message: this.$t('roleLang.selectOptions'),
							type: 'warning'
						});
					}
				},
				authorizationClose() {
					this.authorizationVisible = false
				},
				authorizationSave() {
					let nodesDOM = this.$refs.tree.$el.querySelectorAll('.el-tree-node');
			        let nodesVue = [].map.call(nodesDOM, node => node.__vue__);
			        let nodeList = nodesVue.filter(item => item.node.indeterminate === true);
			        let key = nodeList.map(sub => sub.node.key);
					let module_list = this.$refs.tree.getCheckedKeys()
					module_list = key.join(';') + ";" +  module_list.join(';');
					module_list = module_list.replace(/(^;)|(;$)/g,'');
					this.$httpExt().get('tsRoleModule/saveRoleModule', {
						'module_list': module_list,
						'roleId_module': this.roleId
					}).then((response) => {
						Message({
							message: this.$t('roleLang.authoritySucc'),
							type: 'success'
						});
					}, (response) => {
						Notification.error({
							title: '异常',
							message: response.msg
						});
					})
					this.authorizationVisible = false
				},
				open(){
			
				},
				close(){
					
				},
				handleReset() {
					this.newlyFormVisible = false
				},
				handleSubmit() {
					var that = this
					this.$refs.newlyForm.validate((valid) => {
						if(valid) {
							var currentRow = this.currentRow;
							var newlyForm = this.newlyForm;
							var currentRowData, type, status;
							if(that.dialogTitle == "新增角色") {
								currentRowData = {
									roleCode: newlyForm.encoding,
									roleName: newlyForm.name,
									enRoleName: newlyForm.enroleName, //英文名称
									roleType: newlyForm.type,
									status: newlyForm.status,
									sysFlag: "0",
									roleDesc: newlyForm.roleDesc
								}
							} else if(that.dialogTitle == "修改角色") {
								currentRowData = {
									roleId: currentRow.roleId,
									roleCode: newlyForm.encoding,
									roleName: newlyForm.name,
									enRoleName: newlyForm.enroleName,  //英文名称
									roleType: newlyForm.type,
									sysFlag: currentRow.sysFlag,
									status: newlyForm.status,
									roleDesc: newlyForm.roleDesc
								}
							}
							
							that.$httpExt().get('roleManage/saveRole', currentRowData)
								.then((response) => {
									that.tableHttp();
									that.newlyFormVisible = false
									Message({
										message: this.$t('roleLang.operateSucc'),
										type: 'success'
									});
								}, (response) => {
									Notification.error({
										title: '异常',
										message: response.msg
									});
								})
						} else {
							return false;
						}
					});
				},
				handleNodeClick(a, b, c) {},
				check(a, b, c) {

				},
				sizeChange(pageSize) {
					this.pageSize = pageSize;
					this.tableHttp();
				},
				currentChange(val) {
					this.start = (val - 1) * this.pageSize
					this.tableHttp();
				},
				newTab(title, content) {
					this.$emit("page", title, content)
				},
			}
	}
</script>

<style lang="less">
	.roleList {
		.el-tree {
			height: 550px;
			overflow-y: scroll;
		}
	}
</style>