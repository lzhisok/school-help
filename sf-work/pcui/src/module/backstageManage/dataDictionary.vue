<template>
	<el-row class="dataDic">
		<el-col :span="24">
			<el-form :inline="true" :model="formSearch" class="demo-form-inline" label-position="right" label-width="80px">
				<el-form-item :label="$t('dataDictionaryLang.dicKey')">
					<el-input v-model="formSearch.dicKey" id="dicKey" :placeholder="$t('dataDictionaryLang.placeholderKey')"></el-input>
				</el-form-item>
				<el-form-item :label="$t('dataDictionaryLang.dcname')">
					<el-input v-model="formSearch.dicName" id="dicName" :placeholder="$t('dataDictionaryLang.placeholderDcname')"></el-input>
				</el-form-item>
				<el-button type="primary" @click="onSearch">{{$t('dataDictionaryLang.search')}}</el-button>
			</el-form>
		</el-col>
		<el-col :span="24">
			<div>
				<el-button type="primary" size="small" icon="plus" v-on:click="addDicdata" v-if="btns['so_DataDicionary_Add']">{{$t('dataDictionaryLang.addOption')}}</el-button>
				<el-button type="primary" size="small" icon="edit" v-on:click="editRow" v-if="btns['so_DataDicionary_query']">{{$t('dataDictionaryLang.editOption')}}</el-button>
				<el-button type="primary" size="small" icon="delete" v-on:click="deleteRow" v-if="btns['so_DataDicionary_delete']">{{$t('dataDictionaryLang.deleteOption')}}</el-button>
			</div>
			<div class="">
				<el-breadcrumb separator="/" class="dic-breadcrumb">
					<el-breadcrumb-item @click.native.prevent="showDictionary('')">root</el-breadcrumb-item>
					<el-breadcrumb-item v-for="(item,index) in pkPathArr" :key="index" :pkeypath="item.pkeypath" @click.native.prevent="showDictionary(item.pkeypath)">{{item.pkey}}</el-breadcrumb-item>
				</el-breadcrumb>
			</div>
			<div class="data-list">
				<el-table :data="dicData" border style="width: 100%" highlight-current-row @current-change="handleCurrentChange">
					<el-table-column width="38">
						<template slot-scope="scope">
							<label class="radio">
								<input type="radio" value="2" name="radio" :data-index="scope.$index">
								<span class="dot"></span>
							</label>
						</template>
					</el-table-column>
					<el-table-column :label="$t('dataDictionaryLang.dicKey')" width="150">
						<template slot-scope="scope">
							<div v-if="scope.row.hasChild > 0">
								<span v-on:click="showDictionary()" :pkeyPath="scope.row.pkPathString" :title="scope.row.descript">
									<a href="javascript:void(0);">{{ scope.row.dicKey }}</a>
								</span>
							</div>
							<div v-else>
								<span :pkeyPath="scope.row.pkPathString" :title="scope.row.descript">
									{{ scope.row.dicKey }}
								</span>
							</div>
						</template>
					</el-table-column>
					<el-table-column prop="dicName" :label="$t('dataDictionaryLang.dcname')" show-overflow-tooltip></el-table-column>
					<el-table-column prop="dicValue" :label="$t('dataDictionaryLang.dicValue')" width="150"></el-table-column>
					<el-table-column prop="status" :label="$t('dataDictionaryLang.state')" width="80" :formatter="formatterStatus"></el-table-column>
					<el-table-column prop="sn" :label="$t('dataDictionaryLang.sequenceNum')" width="70"></el-table-column>
					<el-table-column prop="createTm" :label="$t('dataDictionaryLang.createTime')" width="95">
						<template slot-scope="scope">
							{{scope.row.createTm.substring(0,10)}}
						</template>
					</el-table-column>
					<el-table-column prop="updateTm" :label="$t('dataDictionaryLang.editTime')" width="95">
						<template slot-scope="scope">
							{{scope.row.updateTm.substring(0,10)}}
						</template>
					</el-table-column>
				</el-table>
				<el-pagination @size-change="pageSizeChange" @current-change="handleCurrentChangePage" :current-page="pagination.currentPage" :page-sizes="[10,20, 50, 100, 200]" :page-size="pagination.pageSize" layout="->,prev, pager, next, jumper, sizes,total" :total="pagination.totalSize">
				</el-pagination>
			</div>
		</el-col>
		<el-col :span="24">
			<!--新增和修改数据字典-->
			<el-dialog :title="$t('dataDictionaryLang.dicTitle')" :visible.sync="addAndModifyDicdata" width="40%">
				<el-form :model="dictionayForm" ref="dictionayForm" :rules="rules" label-width="100px">
					<el-form-item :label="$t('dataDictionaryLang.dicKey')" prop="dicKey">
						<span v-if="isAdd">
							<el-input v-model="dictionayForm.dicKey" auto-complete="off" :placeholder="$t('dataDictionaryLang.placeholderKey')"></el-input>
						</span>
						<span v-else>
							<el-input v-model="dictionayForm.dicKey" auto-complete="off" :placeholder="$t('dataDictionaryLang.placeholderKey')" readonly></el-input>
						</span>
					</el-form-item>
					<el-form-item :label="$t('dataDictionaryLang.dcname')" prop="dicName">
						<el-input v-model="dictionayForm.dicName" auto-complete="off" :placeholder="$t('dataDictionaryLang.placeholderDcname')"></el-input>
					</el-form-item>
					<el-form-item :label="$t('dataDictionaryLang.dicValue')" prop="dicValue">
						<el-input v-model="dictionayForm.dicValue" auto-complete="off" :placeholder="$t('dataDictionaryLang.dicValue')"></el-input>
					</el-form-item>
					<el-form-item :label="$t('dataDictionaryLang.sequenceNum')" prop="sn">
						<el-input v-model.number="dictionayForm.sn" auto-complete="off" :placeholder="$t('dataDictionaryLang.sequenceNum')"></el-input>
					</el-form-item>
					<el-form-item :label="$t('dataDictionaryLang.isEffective')" prop="status">
						<el-select v-model="dictionayForm.status">
							<el-option :label="$t('dataDictionaryLang.effective')" value="1"></el-option>
							<el-option :label="$t('dataDictionaryLang.invalid')" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item :label="$t('dataDictionaryLang.description')">
						<el-input type="textarea" v-model="dictionayForm.descript" auto-complete="off" :placeholder="$t('dataDictionaryLang.description')"></el-input>
					</el-form-item>
					<input v-model="dictionayForm.dicId" type="hidden" />
					<input v-model="dictionayForm.parentId" type="hidden" />
					<input v-model="dictionayForm.pkeyPath" type="hidden" />
					<input v-model="dictionayForm.createBy" type="hidden" />
					<input v-model="dictionayForm.createTm" type="hidden" />
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="addAndModifyDicdata = false">{{$t('dataDictionaryLang.cancelOption')}}</el-button>
					<el-button type="primary" @click="saveDictionary('dictionayForm')">{{$t('dataDictionaryLang.submitOption')}}</el-button>
				</div>
			</el-dialog>
		</el-col>
	</el-row>
</template>
<script>
import {
	Message
} from 'element-ui';
export default {
	props: ['btns'],
	data() {
		var dicKeyValidator = (rule, value, callback) => {
			var reg = new RegExp(/^[a-zA-Z][a-zA-Z0-9_]*$/);
			if (!reg.test(value)) {
				callback(new Error('字母开头,且只能输入字母、数字、下划线'));
			}
			callback();
		};
		var snValidator = (rule, value, callback) => {
			var reg = new RegExp(/^\d{1,4}$/);
			if (!reg.test(value)) {
				callback(new Error('只能填写1到4位的数字'));
			}
			callback();
		};
		return {
			formSearch: {
				dicKey: '',
				dicName: ''
			},
			dicData: [],
			pkPathString: '',
			pkPathArr: [],
			parentId: '0',
			index: "",
			addAndModifyDicdata: false,
			dictionayForm: {
				dicKey: '',
				dicName: '',
				dicValue: '',  
				sn: '',
				status: '',
				descript: '',
				dicId: '',
				parentId: '',
				pkeyPath: '',
				createBy: '',
				createTm: ''
			},
			isAdd: true,
			rules: {
				dicKey: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请输入字典Key':'please enter DictionaryKey',
				}, {
					validator: dicKeyValidator
				}, {
					max: 20,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN-CN')?'最多输入20个字符':'enter 20 character most',
				}],
				enDicKey: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请输入字典Key':'please enter DictionaryKey',
				}, {
					validator: dicKeyValidator
				}, {
					max: 20,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'最多输入20个字符':'enter 20 character most',
				}],
				dicName: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请输入字典名称':'please enter Dictionary name',
				}, {
					max: 150,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'最多150个字符':'enter 150 character most',
				}],
				enDicName: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请输入字典名称':'please enter Dictionary name',
				}, {
					max: 150,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'最多150个字符':'enter 150 character most',
				}],
				dicValue: [{
					required: false,
				}, {
					max: 500,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'最多500个字符':'enter 500 character most',
				}],
				sn: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请输入顺序号':'please enter sequence',
				}, {
					validator: snValidator
				}],
				status: [{
					required: true,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'请选择状态':'please select state',
				}],
				descript: [{
					max: 600,
					message: (window.sessionStorage.getItem('lang') == 'zh-CN')?'描述信息不能超过600个字符':'enter 600 character most'
				}]
			},
			currentRow: null,
			pagination: {
				totalSize: 0,
				pageSize: 20,
				currentPage: 1,
				totalPage: 0,
			},
		}
	},
	mounted() {
		this.searchHttp("", "", "");
	},
	methods: {
		searchHttp(pkeyPath, dicKey, dicName) {
			this.$httpExt().post('dictionary/queryPageHelper', {
				pkeyPath: pkeyPath,
				dicKey: dicKey,
				dicName: dicName,
				currentPage: this.pagination.currentPage,
				pageSize: this.pagination.pageSize
			})
				.then((response) => {
					for (let item of response.result.rows) {
						item.pkPathString = item.pkeyPath && (item.pkeyPath + "." + item.dicKey) || item.dicKey;
					}
					this.pagination.totalSize = response.result.totalSize;
					this.dicData = response.result.rows;
					if (response.result.length != 0) {
						this.parentId = response.result.rows[0].parentId;
					}
					this.index = "";
				}, (response) => {
					Message({
						message: this.$t('dataDictionaryLang.requestFail'),
						type: 'warning'
					});
				});
		},
		handleCurrentChangePage(val) {
			this.pagination.currentPage = val;
			this.searchHttp(this.pkPathString, this.formSearch.dicKey, this.formSearch.dicName, );
		},
		pageSizeChange(val) {
			this.pagination.pageSize = val;
			this.searchHttp(this.pkPathString, this.formSearch.dicKey, this.formSearch.dicName, );
		},
		onSearch() {
			this.searchHttp(this.pkPathString, this.formSearch.dicKey, this.formSearch.dicName);
		},
		handleCurrentChange(val) {
			var that = this
			this.currentRow = val;
			setTimeout(function() {
				if (that.$el.querySelector("tr.current-row")) {
					var current = that.$el.querySelector("tr.current-row").querySelector("input[type=radio]")
					that.index = current.dataset.index
				}
			}, 30);
		},
		addDicdata() {
			this.isAdd = true;
			if (this.index) {
				if (this.dicData[this.index].pkeyPath == '') {
					var pkeypath = this.dicData[this.index].dicKey;
				} else {
					var pkeypath = this.dicData[this.index].pkeyPath + "." + this.dicData[this.index].dicKey;
				}
				var parentId = this.dicData[this.index].dicId;
			} else {
				var pkeypath = this.pkPathString;
				var parentId = this.parentId;
			}
			this.addAndModifyDicdata = true;
			var dictionary = {
				dicKey: '',
				dicName: '',
				dicValue: '',
				sn: '',
				status: '1',
				descript: '',
				dicId: '',
				parentId: parentId,
				pkeyPath: pkeypath,
				createBy: '',
				createTm: ''
			}
			this.dictionayForm = dictionary;
			if (this.$refs['dictionayForm'] != undefined) {
				this.$refs['dictionayForm'].resetFields();
			}
		},
		showDictionary(tag) {
			this.pkPathArr = [];
			var pkeypath = '';
			if (tag != undefined && tag != null) {
				pkeypath = tag;
			} else {
				var pkPathString = event.currentTarget.getAttribute("pkeypath");
				pkeypath = pkPathString;
			}
			var keys = pkeypath.split(".");
			for (var i = 0; i < keys.length; i++) {
				var pArr = {
					pkeypath: keys.slice(0, i + 1).join("."),
					pkey: keys[i]
				}
				this.pkPathArr.push(pArr);
			}
			this.pkPathString = pkeypath;
			this.searchHttp(pkeypath, this.formSearch.dicKey, this.formSearch.dicName);
		},
		saveDictionary(formName) {
			if (this.isAdd) {
				var httpUrl = 'dictionary/insert';
			} else {
				var httpUrl = 'dictionary/updateByPrimaryKey';
			}
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.$httpExt().post(httpUrl, {
						dicId: this.dictionayForm.dicId,
						dicKey: this.dictionayForm.dicKey,
						enDicKey : this.dictionayForm.enDicKey, // 英文字典Key
						dicName: this.dictionayForm.dicName,
						enDicName: this.dictionayForm.dicName,
						dicValue: this.dictionayForm.enDicName, // 英文名称
						sn: this.dictionayForm.sn,
						status: this.dictionayForm.status,
						descript: this.dictionayForm.descript,
						parentId: this.dictionayForm.parentId,
						pkeyPath: this.dictionayForm.pkeyPath,
						createBy: this.dictionayForm.createBy,
						createTm: this.dictionayForm.createTm,
					})
						.then((response) => {
							var result = response;
							switch (result.succ) {
								case 'ok':
									var typeMsg = 'success'
									break;
								default:
									var typeMsg = 'warning'
									break;
							}
							Message({
								message: result.msg,
								type: typeMsg
							});
							this.addAndModifyDicdata = false;
							this.onSearch();
						}, (response) => {
							Message({
								message: this.$t('dataDictionaryLang.requestFail'),
								type: 'warning'
							});
						});
				} else {
					return false;
				}
			});

		},
		editRow() {
			this.isAdd = false;
			if (this.index) {
				this.addAndModifyDicdata = true;
				var currentRow = this.currentRow;
				var currentRowData = {
					dicId: currentRow.dicId,
					dicKey: currentRow.dicKey,
					dicName: currentRow.dicName,
					dicValue: currentRow.dicValue,
					sn: currentRow.sn,
					status: String(currentRow.status),
					descript: currentRow.descript,
					parentId: currentRow.parentId,
					pkeyPath: currentRow.pkeyPath,
					createBy: currentRow.createBy,
					createTm: currentRow.createTm
				}
				this.dictionayForm = currentRowData;
				if (this.$refs['dictionayForm'] != undefined) {
					this.$refs['dictionayForm'].resetFields();
				}
				this.dialogTitle = "修改数组字典";
			} else {
				Message({
					message: this.$t('dataDictionaryLang.selectOptions'),
					type: 'warning'
				});
			}
		},
		deleteRow() {
			if (this.index) {
				var d = this.dicData[this.index] || {}, hasChild = d.hasChild, dicId = d.dicId;
				if (hasChild > 0) {
					Message({
						message: this.$t('dataDictionaryLang.childNode'),  
						type: 'error'
					});
				} else {
					this.$confirm(this.$t('dataDictionaryLang.deleteThisRole'), this.$t('dataDictionaryLang.tips'), {
						confirmButtonText: this.$t('dataDictionaryLang.submitOption'),
						cancelButtonText: this.$t('dataDictionaryLang.cancelOption'),
						type: 'warning'
					}).then(() => {
						this.$httpExt().get('dictionary/deleteByPrimaryKey/' + dicId, {
						})
							.then((response) => {
								switch (response.succ) {
									case 'ok':
										Message({
											message: this.$t('dataDictionaryLang.deleteSucc'),
											type: 'success'
										});
										break;
									default:
										break;
								}
								this.onSearch();
							}, (response) => {
								Message({
									message: this.$t('dataDictionaryLang.requestFail'),
									type: 'warning'
								});
							});
					}).catch(() => {
						Message({
							message: this.$t('dataDictionaryLang.cancelDelete'),  
						});
					});
				}
			} else {
				Message({
					message: this.$t('dataDictionaryLang.selectOptions'),
					type: 'warning'
				});
			}

		},
		formatterStatus(row, column) {
			return row.status > 0 ? this.$t('dataDictionaryLang.effective') : this.$t('dataDictionaryLang.invalid');   
		}
	}
}
</script>
<style>
.fl {
	float: left;
}

.dataDic a {
	color: #20a0ff;
	text-decoration: none;
}

.dic-breadcrumb {
	margin-top: 15px;
	height: 20px;
	line-height: 20px;
	font-size: 16px;
}

.dic-pagination {
	float: right;
	margin-top: 15px;
}
</style>