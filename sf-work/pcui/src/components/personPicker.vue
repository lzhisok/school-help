/**
 *@author：weihui
 *@pramas: 
  * "v-model",array,输入是初始化的数据，输出是被选中的人员,必填无默认.输入格式：[{name:xxx,empNum:123},{name:yyy,empNum:456}]
  * "showModal"，boolean,如果是嵌套框为false,不按照要求传会引起样式问题，非必填默认false
  * "labelName",string,输入框的label名称,非必填无默认
  * "disabled",boolean,是否禁用，非必填默认false
  * "multiple",boolean,是否是多选，非必填默认true
  * "top",string,组件弹框距离页面顶部的距离，非必填默认“15%”
  * "isNest",boolean,是否是嵌套弹框，非必填默认false
 * 详细可以参考指令页面引入的人员和组织选择器
 * 备注：把组件引入页面，必须使用element-ui的form表单进行包裹。
 */
<template>
	<el-form-item :label="labelName" required>
		<el-tooltip class="item" effect="dark" :disabled="!auditedManagerTx" :content="auditedManagerTx" placement="top-end">
			<el-input 
				style="width:100%"
				placeholder="===请选择===" 
				:value="auditedManagerTx" 
				:disabled="disabledVal" 
				@focus="handleFocus"
				size="small">
			</el-input>
		</el-tooltip>
		<el-dialog
			:class="{'persion-dialog': true, 'person-nest': isNest}"
			title="人员选择"
			:top="topVal"
			:modal="showModalVal" 
			:visible.sync="personPickerVisible" 
			@open="onOpen" 
			@close="onClose">
			<el-col :span="17">
				<el-col :span="24">
					<el-col :span="6"></el-col>
					<el-col :span="18" style="text-align:left;width:100%;">
						<el-input
							class="person-input"
							icon="search"
							size="small"
						    v-model="personSearch"
							:on-icon-click="handleSearch"
						    placeholder="请输入人员信息：工号、姓名"
						    @change="handleSearch">
						</el-input>
					</el-col>
				</el-col>						
				<el-col :span="24">
				<!--组织树-->
					<el-col :span="14" class="person-tree-wrap">		
						<el-scrollbar
          					wrap-class="el-select-dropdown__wrap"
      						view-class="el-select-dropdown__list"
      						class="person-picker-left-scroll"
							tag="div">
						    <el-tree
								ref="personTree"
								class="person-tree"
								:data="orgTree"
								:props="props"
								node-key="orgId"
								:load="handleLoad"
								highlight-current
								lazy
								check-strictly
								@node-click="handlePersonNodeClick">
							</el-tree>
						</el-scrollbar>
					</el-col>
					<el-col :span="10" class="person-tree-wrap">
						<!--备选人员-->
						<el-scrollbar
	      					wrap-class="el-select-dropdown__wrap"
	  						view-class="el-select-dropdown__list"
	  						class="person-picker-left-scroll"
							tag="div">
							<el-table
								class="person-picker-tab"
								align="left"
								slot=""
							    :data="personList"
							    :row-class-name="setRowClass"
							    @row-click="handleRowClick">
							    <el-table-column prop="nameNum"></el-table-column>
				  			</el-table>
						</el-scrollbar>
					</el-col>
				</el-col>
			</el-col>
			<el-col :span="7" class="checked-person">  
				<!--已选择人员-->
				<el-scrollbar
  					wrap-class="el-select-dropdown__wrap"
					view-class="el-select-dropdown__list"
					class="person-picker-right-scroll"
					tag="div">
					<el-table 
						class="person-picker-tab"
						:data="selectedDataVal" 
						slot="">
					    <el-table-column prop="nameNum" :label="labelNameVal"></el-table-column>
				        <el-table-column width="40">
					      <template scope="scope">
					        <el-button
					          @click.native.prevent="deleteRow(scope.$index,selectedDataVal)"
					          type="text"
					          size="mini">
					          <i class="el-icon-circle-cross" style="color: #bfcbd9;"></i>
					        </el-button>
					      </template>
					    </el-table-column>
					 </el-table>
				</el-scrollbar>
				<el-col :span="24" class="affirmBtn">				
					<el-button type="primary" @click="handleClick" style="margin-bottom:5px;">确定</el-button>
				</el-col>
			</el-col>
		</el-dialog>
	</el-form-item>
</template>
<script>
  	import { Scrollbar }from 'element-ui';
	import { Message } from 'element-ui';
    import _ from 'underscore';
	export default {
      	name: 'soPersonPicker',
      	componentName: 'soPersonPicker',
      	props: [
      		/*人员初始值*/
      		'value',
			/*是否显示背景阴影*/
	      	'showModal',
			/*label名称*/
	      	'labelName',
			/*是否可以多选*/
	      	'multiple',
			/*离顶部的距离*/
	      	'top',
			/*是否嵌套*/
			'isNest',
			/*是否可编辑*/
	      	'disabled'
      	],  
      	components: {
	    },
      	computed: {
		    showPersonList(){//是否显示备选人员列表
		    	return this.personList.length>0?true:false;
		    },
			auditedManagerTx() {//单位负责人（展示）
				var managers = this.selectedData;
				var managerArr = [];
				for(var i in managers){
					var managerNameNum = managers[i].name + '/' + managers[i].empNum;
					managerArr.push(managerNameNum);
				}
				return managerArr.toString();
			},
      		multipleVal(){//默认多选
      			return this.multiple == undefined? true: this.multiple;
      		},
      		disabledVal(){//默认可用
      			return this.disabled == undefined? false: this.disabled;
      		},
      		showModalVal(){//默认显示遮罩（双层弹框参数）
      			return this.showModal == undefined? true: this.showModal;
      		},
      		topVal(){//默认15%
      			return this.top == undefined? '15%': this.top + '';
      		},
			isNestVal(){//默认不嵌套
				return this.isNest == undefined? false: this.isNest;
			},
			labelNameVal(){//已选人员个数
				return "已选择人员("+this.selectedDataVal.length+"):"
			}
		},
      	watch: {
      		value(val) {
      			this.selectedData = val;
      		},
		    selectedData(val) {
		        this.$emit('input', val);
		    }
      		
      	},
      	data(){
      		return{
      			preNode:'',//前一个节点
      			currentOrg:'',//当前组织树节点
      			personSearch:"",//模糊搜索框
	    		personPickerVisible:false,//弹框可见
      			props:{//组织树节点的名称和子节点
		          	label: 'orgName',
			        children: 'children'
		        },
		        orgTree:[],//整棵组织树
			    personList:[],//备选人员
	      		selectedData:this.value||[], /*selectedData = {empNum:111,name:panxiao,nameNum:panxiao/111}*/
			    selectedDataVal:[],//初始化选择
			    delRow:{}
      		}
      	},
      	methods: {
      		handleFocus(){
      			//选择人员输入框聚焦的时候查询组织根节点
      			this.$emit("beforePop");
      			this.personPickerVisible = true;
      		},
      		handleLoad(node,resolve){
      			//加载组织树
      			var param;
  				if(node.level == 0){//从第二层开始组织查询分为区部，顺丰科技等等
	  				param = {region:'all',paging:'0'};
      			}else if(node.level > 0){
					param = {parentID:node.data.orgId,region:'all',paging:'0'};
				}
				this.$httpExt().post("common/queryOrg",param)
				.then((response) => {
					resolve(response.result);
				},(response) => {
					Message({
						message: '请求-加载人员子节点失败，请重试！',
						type: 'warning'
					});
				});
      		},
		    handlePersonNodeClick(data,node,ref){//组织树节点的点击事件
		    	//点击节点显示人员列表
				this.currentOrg = data
				if(this.currentOrg != this.preNode){//点击同一个树节点不发送请求
					this.preNode = data;
					var obj = {
						likeStr:this.currentOrg.orgId,
						pageNum:1,
						pageSize:2000
					};
					this.getPersonHttp(obj);			
				}
		    },
      		handleSearch() {//模糊搜索
      			this.handleSearch0(this);
      		},
      		handleSearch0: _.debounce((vm) => {
      			if(/^[\u4e00-\u9fa5]/g.test(vm.personSearch) || /^\d{3,}$/.test(vm.personSearch)){
	      			vm.personList = []
					vm.getPersonHttp({
						likeStr: vm.personSearch,
						pageNum:1,
						pageSize:2000})
      			}
			}, 500),
	   		getPersonHttp(obj){
	   			//搜索人员：组织选择or模糊搜索
	   			this.$httpExt().post("common/queryEmp", obj)
				.then((response) => {
					var result = response.result;
					var persons = [];
					var list = result.list
					for(var i in list){
						var person = {};//员工姓名和员工号
						person.nameNum = list[i].lastName + '/'+list[i].empNum
						person.name = list[i].lastName 
						person.empId = list[i].empId
						person.empNum = list[i].empNum
						persons.push(person)
					}
					this.personList = persons;
				},(response) => {
					Message({
						message: response.msg+'请求-加载人员子节点失败，请重试！',
						type: 'warning'
					});
				});
	   		},
      		handleClick(){//点击确认
      			if(this.selectedDataVal == undefined || this.selectedDataVal.length == 0 ){
      				Message({
						message: '人员选择为必填项！',
						type: 'warning'
					});
					return;
      			}
      			this.selectedData = this.selectedDataVal;
      			this.personPickerVisible = false;
      		},
      		handleRowClick(row, event, column){//点击选择备选人员
      			if(this.selectedDataVal.length == 0){//传入的数据为空的情况
	      			this.selectedDataVal.push(row);
      			}else{//数据不为空的情况
					if(this.multipleVal){//多选
						for(var i in this.selectedDataVal){
		      				if(this.selectedDataVal[i].empNum == row.empNum){//防重
		      					return;
		      				}
		      			}
		      			this.selectedDataVal.push(row);
					}else{//单选
						this.selectedDataVal.pop();
						this.selectedDataVal.push(row);
					}
      			}
      		},
      		deleteRow(index, rows){//删除已选择人员
      			this.delRow = rows[index]
      			rows.splice(index, 1);//状态同步
      			for(let [index,item] of this.personList.entries()){
      				if (item.empNum == this.delRow.empNum) {
      					this.$set(this.personList, index, Object.assign({},item,{}));
      					break;
      				}
      			}
      		},
      		setRowClass(row,index){//备选人员状态同步
      			for(var i in this.selectedDataVal){
	      			if(this.selectedDataVal[i].empNum  == row.empNum){
	      				return 'checked-row';
	      			}
      			}
      			return 'unchecked-row';
      		},
      		onClose() {//组件对话框关闭时置空
      			this.selectedDataVal = [];
      		},
      		onOpen() {//组件对话框打开进行初始化
      			if (!this.selectedData) {
      				return;
      			}
      			this.personSearch = ''
      			this.personList = []
      			for(var i in this.selectedData){
  					var res = this.selectedData[i];
  					var desc = {};
  					desc.name = res.name;
  					desc.empNum = res.empNum;
  					desc.nameNum = res.name+'/'+res.empNum;
  					this.selectedDataVal.push(desc);
  				}
      		}
   		 }
	}
</script>

<style>
.checked-row td div::after{
	content: '';
    position: absolute;
    top: 8px; 
    left: 12px;
    height: 10px;
    width: 10px;
    border-radius: 5px;
    background-color:#20A0FF;
}
.person-picker-left-scroll .person-picker-tab .cell{
    text-indent: 1em;
}
.persion-dialog.person-nest {
	overflow:visible;
}
.persion-dialog .el-dialog {
	width:800px !important;
	height:560px !important;
}
.persion-dialog .el-dialog .el-dialog__body{
	padding: 10px 20px;
}
.person-tree .el-tree-node__content{
	line-height:2em;
	height:2em
}
.person-picker-tab th.is-leaf{
	border-bottom:none;
	text-align: left;
}
.person-picker-tab .el-table__header-wrapper thead div{
	background-color:#fff
}
.person-picker-left-scroll .el-select-dropdown__wrap {
	max-height: 401px;
	height: 401px;
}
.person-picker-right-scroll .el-select-dropdown__wrap {
	max-height: 394px;
	height: 394px;
}
.person-picker-left-scroll .person-picker-tab th{
	display: none;
}
.person-picker-tab th{
	background: none;
	height:2em;
}
.person-picker-tab td{
	border:none;
	height:2em;
}
.person-picker-tab .cell{
	line-height: 1em;
}
</style>

<style scoped> 
.person-tree{
	border:none;
}
.person-input{
	width: 98.5%;
	padding:15px 0 9px 0
}
.person-picker-tab{
	width: 100%;
	text-align: left;
	border:none;
}
.person-picker-tab.el-table::before{
	height:0px;
}
.person-picker-tab.el-table::after{
	width:0px;
}
.person-tree-wrap{
	text-align: left;
	border:1px solid #dfe6ec;
}
.checked-person{
    margin-top: 15px;
	text-align: left;
	border:1px solid #dfe6ec
}
.affirmBtn{
	text-align: center;
	margin-top: 5px;
}
</style>