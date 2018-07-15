<template>
	<el-row class="userList">
		<el-col :span="10" class="contentLeft">
			<div class="moduleManges">
				<label>{{ $t('functionListLang.functionModule')}}</label>
				<i class="el-icon-plus addModuleIcon" v-on:click="addRootLevel"></i>
			</div>
			<!--<div class="moduleTreeview" >
	    		<el-tree :data="data" :props="defaultProps"  @node-click="handleNodeClick">
	    			aaa
	    			<i class="el-icon-plus addModuleIcon" ></i>
	    		</el-tree>
	    	</div>-->
			<div class="moduleTreeview">
				<ul v-for="(menuItem,index) in treeData" :key="index">
					<tree :model="menuItem" @data="dat" :control='control' :form='form' :data1='treeData'></tree>
				</ul>
			</div>
		</el-col>
		<el-col :span="14" class="contentRight">
			<el-form ref="form" :model="form" label-width="100px" :rules="rules">
				<el-form-item label="父节点" hidden="hidden">
					<el-input class="1" v-model="form.moduleId"></el-input>
				</el-form-item>
				<el-form-item label="当前节点" hidden="hidden">
					<el-input v-model="form.parentId"></el-input>
				</el-form-item>
				<el-form-item :label=" $t('functionListLang.moduleName')" prop="moduleName">
					<el-input v-model="form.moduleName" :placeholder="$t('functionListLang.moduleName')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.moduleCharset')" prop="moduleCode">
					<el-input v-model="form.moduleCode" :placeholder="$t('functionListLang.moduleCharset')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.iconStyle')">
					<el-input v-model="form.moduleIcon" :placeholder="$t('functionListLang.iconStyle')+'  class'"></el-input>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.moduleModel')">
					<!-- 1:'ROOT',2:'APPLICATION',3:'MENU',4:'WIDGET'  moduleType几种值属性-->
					<el-select v-model="form.moduleType" class="2">
						<el-option :label="$t('functionListLang.menuList')" value="3" v-if="control.menu"></el-option>
						<el-option :label="$t('functionListLang.pageButton')" value="4" v-if="control.pageBtn"></el-option>
						<el-option :label="$t('functionListLang.childSystem')" value="2" v-if="control.childSystem"></el-option>
						<!-- <el-option  label="菜单目录" value="MENU"   v-if="control.moduleType.menu"></el-option>
				      <el-option  label="页面按钮" value="WIDGET" v-if="control.moduleType.pageBtn"></el-option>
				      <el-option  label="子系统" value="APPLICATION" v-if="control.moduleType.childSystem"></el-option>-->
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.isHide')" prop="hidden">
					<template>
						<el-radio v-model="form.hidden" label="N">{{$t('functionListLang.nHide')}}</el-radio>
						<el-radio v-model="form.hidden" label="Y">{{$t('functionListLang.hide')}}</el-radio>
					</template>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.systemCharset')" v-if="control.seen" prop="sysCode">
					<el-input v-model="form.sysCode" :placeholder="$t('functionListLang.systemCharset')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.functionType')" hidden="hidden" prop="appType">
					<el-select v-model="form.appType" placeholder="====请选择====">
						<el-option label="PC WEB" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.sequenceNum')" prop="sort" :rules="[{ required: true, message: $t('functionListLang.sequenceNumLimit')},{ type: 'number', message: $t('functionListLang.sequenceNumType')} ]">
					<el-input v-model.number="form.sort" :placeholder="$t('functionListLang.sequenceNum')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('functionListLang.functionUrl')">
					<el-input v-model="form.actionUrl" :placeholder="$t('functionListLang.functionUrl')"></el-input>
				</el-form-item>
				<!-- <el-form-item label="iframe属性">
			       <el-select v-model="form.helpUrl" placeholder="====请选择====">
				      <el-option  label="div" value="div"></el-option>
				      <el-option  label="iframe" value="iframe"></el-option>
				    </el-select>
				    <p style="margin-bottom: -10px;margin-top: 0px;color: #8a6d3b;">选择你所创建的页面将在系统中的嵌入形式</p>
			  </el-form-item>-->
				<el-form-item :label="$t('functionListLang.description')">
					<el-input type="textarea" v-model="form.moduleDesc"></el-input>
				</el-form-item>
				<el-form-item class="btn_save" v-if="control.save">
					<el-button type="primary" v-on:click="submitForm">{{$t('functionListLang.saveModule')}}</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!--弹出提示保存成功-->
		<el-dialog :title="$t('functionListLang.saveFunctionModule')" :visible.sync="saveForm">
			<div class="dialog-content">
				{{$t('functionListLang.savaSucc')}}
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="saveFormAfter">{{$t('functionListLang.cancelModule')}}</el-button>
				<el-button type="primary" @click="saveFormAfter">$t('functionListLang.submieModule')</el-button>
			</div>
		</el-dialog>

	</el-row>
</template>

<script>
	import {
		Message
	} from 'element-ui';
	import Tree from './functionListtree'
	export default {
		components: {
			Tree
		},
		data() {
			return {
				treeData: [],
				form: {
					moduleId: '',
					parentId: '',
					moduleName: '',
					moduleCode: '',
					moduleIcon: '',
					moduleType: '3',
					sysCode: '',
					appType: '1',
					hidden: 'N',
					sort: '',
					actionUrl: '',
					moduleDesc: '',
				},
				control: {
					seen: false,
					childSystem: true,
					pageBtn: true,
					menu: true,
					save: false,
				},
				saveForm: false,
				rules: {
					moduleName: [{
							required: true,
							message: this.$t('functionListLang.moduleNameTest'),
							trigger: 'blur'
						},
						{
							min: 2,
							max: 15,
							message: this.$t('functionListLang.moduleNameLimit'),
							trigger: 'blur'
						}
					],
					moduleCode: [{
						required: true,
						message: this.$t('functionListLang.moduleCharsetTest'),
						trigger: 'blur'
					}],
					hidden: [{
						required: true,
						message: this.$t('functionListLang.isHideTest'),
						trigger: 'change'
					}],
					/* sort: [
				            { required: true, message: '请填写顺序号', trigger: 'blur' },
						   { type: 'number', message: '顺序号必须为数字值',trigger: 'blur'}  
						  ],*/
					sysCode: [{
						required: true,
						message: this.$t('functionListLang.moduleSysCharset'),
						trigger: 'blur'
					}]
				},

			}
		},
		beforeCreate() {
			this.$httpExt().post('module/queryEntityList')
				.then((response) => {
					this.treeData = response.result;
				}, (response) => {
					Message({
						message: this.$t('functionListLang.requestFail'),
						type: 'warning'
					});
				});
			/*this.$http.get('http://aos.intsit.sfdc.com.cn:1080/module/queryEntityList?token=111')
				.then(function(response) {
					this.treeData = response.data.result;
				}, function(response) {
					Message({
						message: '服务器请求失败，请重试！',
						type: 'warning'
					});
				});*/
		},
		computed: {
			functionListLang() {
				if(window.sessionStorage.getItem('lang') == 'zh-CN') {
					return {

					}
				}
			}
		},
		methods: {
			searchTreeModule() {
				this.$httpExt().post('module/queryEntityList')
					.then((response) => {
						this.treeData = response.result;
					}, (response) => {
						Message({
							message: this.$t('functionListLang.requestFail'),
							type: 'warning'
						});
					});
			},
			addRootLevel() { //点击功能模块管理增加按钮，右边表单对应显示或者隐藏某些字段
				//先清空表单
				this.form.moduleId = '';
				this.form.parentId = '';
				this.form.moduleName = '';
				this.form.moduleCode = '';
				this.form.moduleIcon = '';
				this.form.moduleType = '2';
				this.form.sysCode = '';
				this.form.appType = '1';
				this.form.sort = '';
				this.form.actionUrl = '';
				this.form.hidden = 'N';
				this.form.helpUrl = '';
				this.form.moduleDesc = '';
				this.control.seen = true;
				this.control.save = true;
				this.control.pageBtn = false;
				this.control.menu = false;
			},
			submitForm() {
				var that = this;
				that.$refs.form.validate((valid) => {
					if(valid) { /*需要传到后台并且重新获取一遍节点层数action:*/
						if(that.form.moduleId != "") {
							var url = 'module/updateByPrimaryKey';
						} else {
							var url = 'module/insert';
						}
						that.$httpExt().post(url, {
								moduleId: that.form.moduleId,
								parentId: that.form.parentId,
								moduleName: that.form.moduleName,
								moduleCode: that.form.moduleCode,
								moduleIcon: that.form.moduleIcon,
								moduleType: that.form.moduleType,
								sysCode: that.form.sysCode,
								appType: that.form.appType,
								sort: that.form.sort,
								actionUrl: that.form.actionUrl,
								hidden: that.form.hidden,
								helpUrl: that.form.helpUrl,
								moduleDesc: that.form.moduleDesc,
							})
							.then((response) => {
								if(response.succ == "ok") {
									that.searchTreeModule();
									that.$refs['form'].resetFields();
									that.form.moduleId = '';
									that.form.parentId = '';
									that.form.moduleIcon = '';
									that.form.moduleDesc = '';
									Message({
										message: this.$t('functionListLang.savaSucc'),
										type: 'success'
									});
									//that.saveForm=true;
								} else {
									Message({
										message: response.message,
										type: 'warning'
									});
								}
							}, (response) => {
								Message({
									message: this.$t('functionListLang.requestFail'),
									type: 'warning'
								});
							});
					} else {
						return false;
					}
				});
			},
			saveFormAfter() {
				this.saveForm = false;
			},

			dat(a) {
				this.treeData = a;
				console.log(a)
			}

		}
	}
</script>
<style lang="less">
	.userList {
		.contentLeft {
			width: 50%;
			float: left;
			padding-right: 5%;
			.addModuleIcon {
				float: right;
				line-height: 36px;
				font-size: 10px;
				margin-right: 14px;
				cursor: pointer;
			}
			.moduleManges {
				height: 36px;
				background: #fff;
				border: 1px solid #d3dce6;
				label {
					margin-left: 10px;
					line-height: 36px;
					font-size: 14px;
				}
			}
			.moduleTreeview {
				height: auto;
				background: #fff;
				border: 1px solid #d3dce6;
				ul {
					margin: 0px;
					padding-left: 0px;
					font-size: 14px;
					li {
						line-height: 36px;
						position: relative;
						z-index: 1;
						.el-icon-plus,
						.el-icon-delete {
							float: right;
							margin-right: 10px;
							font-size: 12px;
							line-height: 35px;
							cursor: pointer;
						}
						.el-icon-delete {
							font-size: 13px;
							margin-top: 1px;
						}
					}
				}
			}
		}
		.contentRight {
			width: 50%;
			float: left;
			padding-right: 5%;
			.el-select {
				width: 100%;
			}
			.btn_save {
				.el-form-item__content {
					text-align: right;
				}
			}
			.el-form-item {
				position: relative;
				.el-form-item__label {
					position: absolute;
				}
			}
		}
	}
</style>