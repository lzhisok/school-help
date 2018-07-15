<template>
	<li v-on:click.stop="showNodeInfo(model.moduleId,model.parentId)">
		<div class="nodeRow" @click="changeColor()">
			<span class="block" v-for="(item,index) in model.nodeLevel" :key="index" :model="item"></span>
			<span>
				 <i v-if="isFolder" v-on:click.stop="toggle"  class="icon" :class="[open ? 'folder folder-open': 'folder']"></i>
				 <i v-if="!isFolder"   class="icon"></i>
				 <span @click="toggle">{{ model.moduleName }}</span>
			<i class="el-icon-plus" v-on:click.stop="addNode(model.moduleId,model.sysCode)"></i>
			<i class="el-icon-delete" v-on:click.stop="removeNode(model.moduleId,model.parentId)"></i>
			</span>
		</div>
		<ul v-show="open" v-if="isFolder">
			<tree-menu v-for="(item,index) in model.children" :key="index" :model="item"></tree-menu>
		</ul>
	</li>
</template>
<script>
	import {
		Message
	} from 'element-ui';
	export default {
		name: 'treeMenu',
		props: ['model', 'form', 'data1', 'control'],
		data() {
			return {
				open: false,
			}
		},
		computed: {
			isFolder: function() {
				return this.model.children && this.model.children.length
			}
		},
		mounted() {
			if(this.model.parentId == 0) {
				this.open = true
			}
		},
		methods: {
			toggle: function() {
				if(this.isFolder) {
					this.open = !this.open
				}
			},
			changeColor() {
				var currenBgColor = event.currentTarget.style.backgroundColor;
				var arrys = document.getElementsByClassName("nodeRow");
				for(var i = 0; i < arrys.length; i++) {
					arrys[i].style.backgroundColor = "white";
					arrys[i].style.color = "black";
					arrys[i].getElementsByClassName("icon")[0].style.borderColor = " transparent transparent transparent rgb(151, 168, 190)";

				}
				if(currenBgColor == "#20A0FF") {
					event.currentTarget.style.backgroundColor = "white";
					event.currentTarget.style.color = "black";
					event.currentTarget.getElementsByClassName("icon")[0].style.borderColor = " transparent transparent transparent rgb(151, 168, 190)";
				} else {
					event.currentTarget.style.backgroundColor = "#20A0FF";
					event.currentTarget.style.color = "white";
					event.currentTarget.getElementsByClassName("icon")[0].style.borderColor = " transparent transparent transparent rgb(255, 255, 255)";

				}
			},
			searchTreeModule() {
				this.$httpExt().post('module/queryEntityList')
					.then((response) => {
						this.$emit("data", response.result);
					}, (response) => {
						Message({
							message: '服务器请求失败，请重试！',
							type: 'warning'
						});
					});
			},
			addNode(parentId, sysCode) { //增加一个节点
				var root = this.$parent.data1 ? this.$parent : this;
				while(root.data1 == undefined) {
					root = root.$parent;
				}
				root.form.moduleId = '';
				root.form.parentId = parentId;
				root.control.seen = false;
				root.control.save = true;
				root.control.pageBtn = true;
				root.control.menu = true;
				root.control.childSystem = false;
				root.form.moduleName = '';
				root.form.hidden = 'N';
				root.form.moduleCode = '';
				root.form.moduleIcon = '';
				root.form.moduleType = '3';
				root.form.sysCode = sysCode;
				root.form.appType = '1';
				root.form.sort = '';
				root.form.actionUrl = '';
				root.form.moduleDesc = '';
			},

			removeNode(moduleId, parentId) { //删除一个节点
				var root = this.$parent.data1 ? this.$parent : this;
				while(root.data1 == undefined) {
					root = root.$parent;
				}
				if(this.$children.length > 0) {
					Message({
						message: '删除的模块有子模块，请先删除子模块！',
						type: 'warning'
					});
					return;
				} else {
					this.$confirm('你确定要删除吗？', '删除提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						this.$httpExt().post('module/deleteByPrimaryKey/' + moduleId)
							.then((response) => {
								if(response.succ == "ok") {
									root.searchTreeModule();
									root.control.seen = false;
									root.control.save = true;
									root.control.pageBtn = true;
									root.control.menu = true;
									root.control.childSystem = false;
									root.form.moduleName = '';
									root.form.moduleCode = '';
									root.form.moduleIcon = '';
									root.form.moduleType = '3';
									root.form.sysCode = '';
									root.form.appType = '1';
									root.form.hidden = 'N';
									root.form.sort = '';
									root.form.actionUrl = '';
									root.form.moduleDesc = '';
									Message({
										message: '删除成功！',
										type: 'success'
									});
								} else {
									Message({
										message: response.msg,
										type: 'warning'
									});
								}
							}, (response) => {
								Message({
									message: '服务器请求失败，请重试！',
									type: 'warning'
								});
							});
					}).catch(() => {
						Message({
							message: '已取消删除！',
						});
					});
				}
			},
			showNodeInfo(moduleId, parentId) {
				this.$httpExt().post('module/queryByOne/' + moduleId)
					.then((response) => {
						var root = this.$parent.form ? this.$parent : this;
						while(root.form == undefined) {
							root = root.$parent;
						}
						root.form.moduleId = moduleId;
						root.form.parentId = parentId;
						root.form.moduleName = response.result.moduleName;
						root.form.moduleCode = response.result.moduleCode;
						root.form.moduleIcon = response.result.moduleIcon;
						root.form.moduleType = response.result.moduleType;
						root.form.sysCode = response.result.sysCode;
						root.form.appType = response.result.appType;
						root.form.sort = response.result.sort;
						root.form.hidden = response.result.hidden;
						root.form.actionUrl = response.result.actionUrl;
						root.form.moduleDesc = response.result.moduleDesc;
						if(root.form.moduleType == "2") {
							root.control.seen = true;
							root.control.save = true;
							root.control.pageBtn = false;
							root.control.menu = false;
							root.control.childSystem = true;
						} else {
							root.control.seen = false;
							root.control.save = true;
							root.control.pageBtn = true;
							root.control.menu = true;
							root.control.childSystem = false;
						}
					}, (response) => {
						Message({
							message: '服务器请求失败，请重试！',
							type: 'warning'
						});
					});
			}
		}
	}
</script>
<style>
	ul {
		list-style: none;
	}
	
	span.block {
		width: 10px;
		display: inline-block;
	}
	
	div.nodeRow {
		position: relative;
		width: 100%;
		height: 36px;
		cursor: pointer;
	}
	
	div.nodeRow:hover {
		background-color: #F5F5F5;
	}
	
	div.nodeRow:visited {
		background-color: #249DD8;
	}
	
	i.icon {
		display: inline-block;
		width: 15px;
		height: 15px;
		background-repeat: no-repeat;
		vertical-align: middle;
	}
	
	.icon.folder {
		display: inline-block;
		cursor: pointer;
		width: 0px;
		height: 0px;
		vertical-align: middle;
		margin-left: 10px;
		transform: rotate(0deg);
		border-width: 6px 0px 6px 7px;
		border-style: solid;
		border-color: transparent transparent transparent rgb(151, 168, 190);
		border-image: initial;
		transition: transform 0.3s ease-in-out;
	}
	
	.icon.folder-open {
		transform: rotate(90deg);
	}
	
	.icon.file-text {
		background-image: url(/src/assets/file-text.png);
	}
	
	.tree-menu li {
		line-height: 30px;
		cursor: pointer;
	}
</style>