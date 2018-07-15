<!--
组织多选选择器分为两个部分：
	1.input框（用来触发人员选择器的弹框，v-model用来获取被选中的组织，必须使用element-ui的form表单进行包裹）
	2.<so-org-picker><so-org-picker>标签，
		*@pramas: 
		 * "v-model",object，例：{初始化的数据:array,弹出框可见:Boolean},必填无默认
		 * "dialogSize"，string,非嵌套对话框为small，嵌套框为full,不按照要求传会引起样式问题,必传
		 * "multiple",boolean,是否是多选，非必填默认true
		 * "region",string,值为all（所有）,region（区部）,head（总部）,tech（顺丰科技）,myorg(我的部门),非必填默认all；
 * 组件的使用：
 		1.把组件引入页面(例子：import soOrgPicker from '../../../components/personPicker.vue';)，
 		2.在components中注册：components: { soOrgPicker }。
 		3.el-tooltip可以在鼠标经过的时候在悬浮中显示被选中的组织单位，在选择的组织个数较多时建议使用，el-tooltip使用详情见elementUI文档
 		
 备注：如需初始化展示已选择的组织，v-model可以传入初始化数据，其格式要求：[{name:xx,id:yy},{name:xx,id:yy}],id需要唯一
 -->
<template>
	<el-dialog title="组织选择" :visible.sync="tempVisible" @open="onOpen" @close="onClose">
	
		<el-col v-if="region == 'all'">
			<el-scrollbar
			  tag="div"
			  wrap-class="el-select-dropdown__wrap"
			  view-class="el-select-dropdown__list"
			  class="org-picker-wrap">
				<el-tree v-if="reload"
					ref="tree"
					:data="orgTree"
					:props="props"
					:load="handleLoad"
					lazy
					node-key="orgId"
					show-checkbox
					@check-change="getSelectedData"
					:default-checked-keys="addedOrg">
				</el-tree>
			</el-scrollbar>
		</el-col>
		<el-col v-else>
			<el-scrollbar
			  tag="div"
			  wrap-class="el-select-dropdown__wrap"
			  view-class="el-select-dropdown__list"
			  class="org-picker-wrap">
				<el-tree v-if="reload"
					ref="tree"
					:data="orgTree"
					:props="props"
					node-key="orgId"
					show-checkbox
					@check-change="getSelectedData"
					:default-checked-keys="addedOrg">
				</el-tree>
			</el-scrollbar>
		</el-col>
		<el-col :span="24" style="text-align: center;">				
			<el-button type="primary" @click="handleClick" style="margin-bottom: 5px;">确定</el-button>
		</el-col>
	</el-dialog>
</template>
<script>
	import { Message } from 'element-ui';
	export default {
      	name: 'soOrgPicker',
      	componentName: 'soOrgPicker',
      	props: [
	      	'value',
	      	'multiple',
	      	'region'
      	],
      	computed: {
			addedOrg() {
				//初始已选节点id
				var orgIds = [];
				for (let [i,org] of this.value.arr.entries()) {
					orgIds.push(org.id);
				}
				return orgIds;
			},
      		multipleVal() {//默认多选
      			return this.multiple == undefined? true: this.multiple;
      		}
      	},
      	data(){
      		return{
      			orgTree: [],//组织树
				reload: false,//重新渲染组件
      			props: {
		          	label: 'orgName',
			        children: 'children'
		        },
				tempVisible:false,
				tempData: []//插件内的中间变量
      		}
      	},
     	watch: {
     		value: {
				deep: true,
				handler(val) {
					this.tempData = val.arr;
					this.tempVisible = val.visible;
				}
			},
			tempVisible(val) {
				this.value.visible = val;
			}
      	},
      	mounted () {
      		if (this.region != 'all' && this.region != undefined) {
      			this.getWholeTreeHttp();
      		}
      	},
      	methods: {
      		handleLoad(node, resolve){
      			//加载树节点
      			var obj = {};
  				if(node.level == 0){//从第二层开始组织查询分为区部，顺丰科技等等
	  				obj.region = this.region;
					obj.paging = '0';
      			}else if(node.level > 0){
					obj.parentID = node.data.orgId;
					obj.region = this.region;
					obj.paging = '0'
				}
  				this.getOrgTree(node, resolve, obj);
      		},
      		getOrgTree(node,resolve,param){
      			//通过父节点来查询子节点
  				let that = this;
      			this.$httpExt().post("common/queryOrg",param)
				.then((response) => {
					resolve(response.result);
				},(response) => {
					Message({
						message: response.msg+'请求-加载人员组织根节点-失败，请重试！',
						type: 'warning'
					});
				});
      		},
      		getWholeTreeHttp(){//直接去查询整棵树
      			this.$httpExt().post("common/queryOrg",{region:this.region,paging:'0'})
				.then((response) => {
					this.orgTree = response.result;
				},(response) => {
					Message({
						message: response.msg+'请求-加载人员组织根节点-失败，请重试！',
						type: 'warning'
					});
				});
      		},
      		handleClick(){
      			//提交选择的组织
      			if(!this.multipleVal && this.tempData.length > 1){
      				//多选和单选
      				Message({
						message: '组织选择为为单选！',
						type: 'warning'
					});
					return;
	      		}
      			if(this.tempData.length < 1){
					//表单验证必填项
      				Message({
							message: '组织选择为必选项！',
							type: 'warning'
						});
					return;
      			}
      			this.value.visible = false;
				this.value.arr = this.tempData;
      		},
      		getSelectedData(data, checked, children) {
      			//获取当前选中的全部节点:data当前节点，checked是被选中状态 orgId orgName orgCode
      			if (this.$refs.tree) {
			    	var checkedOrgs = [];
			    	var nodes = this.$refs.tree.getCheckedNodes();
			    	var selecteds = this.tempData;
			    	for (let [i,node] of nodes.entries()) {//被选中节点数组
			    		var checkedOrg = {};
			    		checkedOrg.id = node.orgId;
			    		checkedOrg.name = node.orgName;
			    		checkedOrgs.push(checkedOrg);
			    	}
			    	for(let [j,selected] of selecteds.entries()){//循环初始数组
			    		var contains = false;
			    		if (data && data.orgId ==selected.id) {//初始数组元素是否是当前节点，且没有被勾选
		    				if (!checked) {
		    					contains = true;
		    				}
		    			}
			    		for (let [i,node] of nodes.entries()) {
			    			if(selected.id == node.orgId){//初始数组元素是否存在于被选中节点数组
			    				contains = true;
			    			}
		    			}
			    		if (!contains) {//是否将初始数组元素放入临时数组
		    				checkedOrgs.push(selecteds[j]);
			    		}
		    		}
			    	this.tempData = checkedOrgs;
      			}
      		},
			onOpen() {
				this.reload = true;
			},
			onClose() {
				//关闭时中间数组滞空
				this.reload = false;
				this.tempData = [];
			}
      	}
	}
</script>
<style>
.org-picker-wrap .el-select-dropdown__wrap {
	max-height: 400px;
	height: 400px;
}
</style>