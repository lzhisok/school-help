<template>
	<div class="staticResource">
		<el-row :span="24" style="margin-bottom: 20px;">
			<el-col class="scrollLeft" :span="6" style="overflow-x: auto;max-height: 800px;color:#409eff">
				<div v-if="nameSpaceTree.length" style="margin-bottom: 10px;text-align: center; border: 1px solid #e1e1e8;margin-right: 10px;">
					<i class="el-icon-refresh"  style="padding: 12px 10px;"   @click="refresh"></i>
					<i class="el-icon-plus"  style="padding: 12px 10px;"    @click="append('')"></i>
					<!--<i :class="expand?'el-icon-caret-bottom':'el-icon-caret-right'"  style="padding: 12px 10px;"    @click="expand=!expand" ></i>-->
				</div>
				<el-col class="leftTree" :span="34">
					 <el-tree v-if="nameSpaceTree.length" ref="tree" node-key="nodeId" :highlight-current="true" :data="nameSpaceTree" :props="defaultProps" 
	                 :expand-on-click-node="true" :render-content="renderContent" :default-expand-all="expand" :accordion='true' @node-click="handleNodeClick"></el-tree>
				</el-col>
			</el-col>
				
			<el-col class="rightBlock" :span="18">
				<div class="nameSpace">{{$t('staticResourceLang.currentNameSpace')}}：{{!nameSpace.nodeName?$t('staticResourceLang.Nchoice'):currentPath}}</div>
				<div v-if="nameSpace.nodeName">
					<div style="width:95%;margin: auto;">
						<el-steps  :active="activeStep" :center="true" >
							<el-step :title="$t('staticResourceLang.chooseStaticRes')" icon="el-icon-picture"></el-step>
							<el-step :title="$t('staticResourceLang.uploading')" icon="el-icon-upload"></el-step>
							<el-step :title="$t('staticResourceLang.docPreview')" icon="el-icon-circle-check"></el-step>
						</el-steps>
					</div>
					<el-upload style="text-align: center;margin-right: 10px;margin-bottom: 20px;"  name="file" :headers="{}" 
					  class="upload-demo" :file-list="fileList"  drag   :with-credentials="true" :action="actionStr" 
					  :before-upload="beforeUpload" :data="{nodeId:nameSpace.nodeId}" :on-error="uploadError" :on-success="uploadSuccess" >
					  <i class="el-icon-upload"></i>
					  <div class="el-upload__text">{{$t('staticResourceLang.uploadTypeOne')}}<em>{{$t('staticResourceLang.uploadTypeTwo')}}</em></div>
					</el-upload>
				    <el-row :span="24" class="tableList">
				    	<p class="textDesc" v-if="activeStep==0">{{$t('staticResourceLang.docUploadStyle')}}</p>
			    		<p class="textDesc" v-if="activeStep==2">{{$t('staticResourceLang.docUploading')}}</p>
			    		<!--预览url列表-->
			    		<div class="nameSpace">{{$t('staticResourceLang.previewList')}}：</div>
			    		<div class="detailTree">
			    			<div v-if="previewList.length>0" class="checkList" v-for="(item, index) in previewList" :key="index">
								<a :href="item" :title="item" target="_blank">{{item}}</a>
								<span class="link"  v-clipboard:copy="item"
									      v-clipboard:success="onCopy"
									      v-clipboard:error="onError"><i></i>{{$t('staticResourceLang.copyLink')}}
								</span>
							</div>
							<div v-if="previewList.length===0" class="el-tree__empty-block"><span class="el-tree__empty-text">{{$t('staticResourceLang.Ndata')}}</span></div>
			    		</div>
						<div class="nameSpace">{{$t('staticResourceLang.nameSpaceMenu')}}</div>
						<div class="detailTree">
							<el-tree  :expand-on-click-node="false" :data="menuList" :props="menuProps" default-expand-all :highlight-current="true" :render-content="renderContent2" ></el-tree>
						</div>
						
					</el-row>
				</div>
				<div v-else class="empty">
					<img src="../../common/images/empty.png">
					<div style="margin-top: 10px;color:#ccc;padding-left: 10px;">{{$t('staticResourceLang.NchooseSpace')}}</div>
				</div>
			</el-col>
	    </el-row>
		<div class="el-dialog__wrapper" style="z-index: 1002;" v-if="formDiolag">
			<div class="el-dialog" style="margin-top: 15vh;">
				<div class="el-dialog__header">
					<span class="el-dialog__title">{{dialogTitle==="新增模块节点"?$t('staticResourceLang.addNode'):$t('staticResourceLang.editNode')}}</span>
					<button  @click="formDiolag=false" type="button" aria-label="Close" class="el-dialog__headerbtn">
						<i class="el-dialog__close el-icon el-icon-close"></i>
					</button>
				</div>
				<div class="el-dialog__body">
					<el-form :model="newlyForm" ref="newlyForm" label-width="150px" :rules="rules">
						<el-form-item :label="$t('staticResourceLang.nodeName')" prop="nodeName">
							<el-input v-model="newlyForm.nodeName"></el-input>
						</el-form-item>
					</el-form>
				</div>
				<div class="el-dialog__footer">
					<div class="dialog-footer">
						<button  @click="formDiolag=false" type="button" class="el-button el-button--default"><span>{{$t('staticResourceLang.cancelModule')}}</span></button> 
						<button @click="handleSubmit" type="button" class="el-button el-button--primary"><span>{{$t('staticResourceLang.submieModule')}}</span></button>
					</div>
				</div>
			</div>
		</div>
		<div v-if="formDiolag" class="v-modal" tabindex="0" style="z-index: 1000;"></div>
	</div>
</template>
<script>
	import {
		Message,MessageBox 
	} from 'element-ui';
	import Vue from 'vue'
	import copyItem from '../../components/example/copyItem.vue'
	Vue.component('copyItem', copyItem)
  export default {
    data() {
      return {
      	expand:false,
      	nameSpace:'',
      	currentPath:'',
        uploadStatus:false,
		previewList:[],
		showFileList:false,
		fileName:'',
		activeStep:0,
		fileList:[],
		nameSpaceTree: [],
        defaultProps: {
          children: 'childModules',
          label: 'nodeName'
        },
        menuList:[],
        menuProps:{
        	children: 'childModules',
          	label: 'nodeName'
        },
        formDiolag:false,
        newlyForm:{
        	nodeName:'',
        },
        rules:{
        	nodeName: [
				{required: true,message: this.$t('staticResourceLang.inputNodeName'),trigger: 'blur'}
        	],
        },
        dialogTitle:'',
      };
    },
    computed: {
		actionStr() {
			return this.$store.state.global.url + 'strs/uploadFile';
		},
	},
	watch: {
		expand(newVal) {
			this.changeExpand();
		},
	},
    mounted() {
    	this.searchNameSpaceTree();
    },
    methods: {
    	changeExpand(){
    		this.searchNameSpaceTree();
    	},
    	onCopy (e) {
	      console.log('You just copied: ' + e.text)
	    },
	    onError (e) {
	      console.log('Failed to copy texts')
	    },
    	append(data) {//树节点添加子节点
    		this.formDiolag=true;
    		this.dialogTitle="新增模块节点";
    		this.nameSpace=data;
	    },
	    remove(node, data) {//树节点删除
	    	if(data.childModules.length>0){
	    		var msg=this.$t('staticResourceLang.deleteMsg');
	    	}else{
	    		var msg=this.$t('staticResourceLang.deleteComfirm');
	    	}
	    	this.$confirm(msg, this.$t('staticResourceLang.deleteTips'), {
	          	confirmButtonText: this.$t('staticResourceLang.submieModule'),
	          	cancelButtonText: this.$t('staticResourceLang.cancelModule'),
	        }).then(() => {
	        	this.$httpExt().get('strs/delete', {nodeId:data.nodeId})
				.then((response) => {
					this.searchNameSpaceTree();
					this.nameSpace="";
				},(response) => {
					MessageBox({
						message: response.msg?response.msg:this.$t('staticResourceLang.requestFail'),
						confirmButtonText: this.$t('staticResourceLang.gotIt')
					});
				});
	        }).catch(() => {
	        });
	    },
		edit(store, data) {//树节点名称编辑
			this.formDiolag=true;
    		this.dialogTitle="修改模块节点名称";
    		this.nameSpace=data;
    		this.newlyForm.nodeName=this.nameSpace.nodeName
	    },
	    handleSubmit(){
	    	var that = this
			this.$refs.newlyForm.validate((valid) => {
				if(valid) {
					if(this.dialogTitle==="新增模块节点"){
						if(this.nameSpaceTree.length){
							var parentId=this.nameSpace.nodeId
						}else{
							var parentId=null;
						}
						var urlH='strs/addNameSpace';
						var obj={
							nodeName:this.newlyForm.nodeName,
							parentId:this.nameSpace.nodeId
						}
					}else if(this.dialogTitle=="修改模块节点名称"){
						var urlH='strs/rename';
						var obj={
							nodeName:this.newlyForm.nodeName,
							nodeId:this.nameSpace.nodeId
						}
					}
					this.$httpExt().post(urlH, obj)
					.then((response) => {
						this.newlyForm.nodeName='';
						this.formDiolag=false;
						this.searchNameSpaceTree();
						this.nameSpace="";
					},(response) => {
						MessageBox({
							message: response.msg?response.msg:this.$t('staticResourceLang.requestFail'),
							confirmButtonText: this.$t('staticResourceLang.gotIt')
						});
					});
				} else {
					return false;
				}
			});
	    },
    	renderContent(h, { node, data, store }) {//渲染树 ，添加删除，编辑按钮
	        return (
	          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
	            <span style="width: 140px;overflow: hidden;text-overflow: ellipsis;">
	              <span class="el-tree-node__label">{node.label}</span>
	            </span>
	            <span>
	              <el-button class="treeBtn" style="font-size: 12px;" type="text" on-click={ () => this.append(data) }><i class="el-icon-plus"></i></el-button>
	              <el-button class="treeBtn" style="font-size: 12px;" type="text" on-click={ () => this.edit(node, data) }><i class="el-icon-edit"></i></el-button>
	              <el-button class="treeBtn" style="font-size: 12px;" type="text" on-click={ () => this.remove(node, data) }><i class="el-icon-delete"></i></el-button>
	            </span>
	          </span>);
	    },
	    renderContent2(h, { node, data, store }){
	    	if(data.childModules.length){
	    		return (
		          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
		            <span >
		              <span class="el-tree-node__label">{node.label}</span>
		            </span>
		            <span style="position: relative;">
						<copy-item  path={data.link}></copy-item>
		            </span>
		          </span>);
    		}else{
    			return (
		          <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
		            <span>
		              <span class="is-leaf"> </span>
		              <span class="el-tree-node__label">{node.label}</span>
		            </span>
		            <span>
		              <copy-item  path={data.link}></copy-item>
		            </span>
		          </span>);
    		}
		    	
	    },
	    refresh(){
	    	this.nameSpace='';
	    	this.activeStep=0;
    		this.fileList=[];
	    	this.previewList=[];
			this.menuList=[];
	    	this.searchNameSpaceTree();
	    },
    	searchNameSpaceTree(){//请求命名空间资源树
    		var that=this;
			this.$httpExt().get('strs/treeNodeList', {
			})
			.then((response) => {
				that.nameSpaceTree=response.result;
				/*this.$refs.tree.setCurrentNode(that.nameSpaceTree[0]);*/
			},(response) => {
				MessageBox({
					message: response.msg?response.msg:this.$t('staticResourceLang.requestFail'),
					confirmButtonText: this.$t('staticResourceLang.gotIt')
				});
			});
    	},
    	handleNodeClick(data){//点击某一层资源节点
    		this.activeStep=0;
    		this.fileList=[];
	    	this.nameSpace=data;
	    	this.previewList=[];
			this.menuList=[];
	    	this.searchDetailList(data);
	    },
    	searchDetailList(data){//查询某一节点的明细
    		var that=this;
			this.$httpExt().get('strs/detailList', {
				nodeId:data.nodeId
			})
			.then((response) => {
				this.currentPath=response.result.currentPath;
				this.previewList=response.result.previewList;
				this.menuList=response.result.menuList;
			},(response) => {
				MessageBox({
					message: response.msg?response.msg:this.$t('staticResourceLang.requestFail'),
					confirmButtonText: this.$t('staticResourceLang.gotIt')
				});
			});
    	},
    	showPreviewList(result){
    		for(var i=0;i<result.length;i++){
				result[i].expanded=false;
				result[i].conflitJar=result[i].conflitJar.split(";")
				result[i].conflitClassList=result[i].conflitClassList.split(";")
			}
			this.previewList=result;
       },
    	beforeUpload(file){
    		this.fileName=file.name;
    		this.uploadStatus=true;
    		this.activeStep=2
    	},
	    uploadSuccess(response, file, fileLis) {
	    	this.fileList=fileLis.slice(-1)
	    	this.uploadStatus=false
	    	switch (response.succ){
	    		case 'ok':
	    			Message({
						message: this.$t('staticResourceLang.completeImport'),
						type: 'success'
					});
					this.activeStep=3
					this.searchDetailList(this.nameSpace);
	    			break;
	    		case 'fail':
	    		this.activeStep=1
	    			MessageBox({
						message: response.msg?response.msg:this.$t('staticResourceLang.requestFail'),
						confirmButtonText: this.$t('staticResourceLang.gotIt')
					});
	    			break;
	    		default:
	    			break;
	    	}
	    },
	    uploadError(err, file, fileList){
	    	this.activeStep=1
	    	this.uploadStatus=false
	    	MessageBox({
				message: this.$t('staticResourceLang.requestFail'),
				confirmButtonText: this.$t('staticResourceLang.gotIt')
			});
	    },
    }
  };
</script>

<style lang="less">
.staticResource	{
	.scrollLeft::-webkit-scrollbar {
		height:6px;
        width: 6px;
        z-index: 1;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 120ms ease-out;
    }
     .scrollLeft::-webkit-scrollbar-thumb{
        background:rgba(151,168,190,.5);
        border-radius:4px;
        cursor: pointer;
        transition: .3s background-color;
        transform: translateY(16.7315%);
    	height: 60%;
    }
	.leftTree{
		min-height: 500px;
		.treeBtn{
			span{
				/*border: 1px solid #bfcbd9;
			    padding: 3px 5px;
			    border-radius: 4px;*/
			}
		}
		.el-tree-node__content{
			height:30px;
		}
	}
	.rightBlock{
		min-height: 500px;
		border-left: 2px dotted #D5E5F5;
		padding-left: 10px;
		.el-steps.el-steps--horizontal{
			width:100%;
		}
		.el-step__title{
			font-size: 14px;
		}
		.empty{
			text-align: center;
			padding-top: 60px;
		}
	}
	.nameSpace{
		height:32px;
		line-height:32px;
		margin-bottom: 15px;
		padding-left: 20px;
		color:#333;
		font-size: 15px;
		font-weight: bold;
		background-image: -webkit-gradient(linear, left top, right top, from(#A0BCD8), to(#D5e5f5));
	}
	.detailTree{
		border: 1px dotted #A0BCD8;
		margin-bottom: 20px;
		.link:hover{
			background-color: #409EFF;
			color:#fff;
			i{
				background-image: url(../../common/images/link1.png);
			}
		}
		.link{
			position: absolute;
			top:0;
			right:0;
			padding: 4px 8px;
			height:20px;
			line-height: 20px;
		    font-size: 12px;
		    color: #767676;
		    cursor: pointer;
		    background-color: #fff;
		    border: 1px solid #e1e1e8;
		    border-top:0;
		    border-right:0;
		    border-bottom-left-radius: 4px;
			i{
				display: inline-block;
				width:15px;
				height:15px;
				background-image: url(../../common/images/link.png);
				background-size: 100% 100%;
				background-repeat: no-repeat;
				margin-bottom: -2px;
				margin-right: 4px;
			}
				
		}
		.is-leaf+.el-tree-node__label:before{
			font-family: 'iconfont'!important;
		    speak: none;
		    font-style: normal;
		    font-weight: 400;
		    font-variant: normal;
		    text-transform: none;
		    line-height: 1;
		    vertical-align: baseline;
		    display: inline-block;
		    -webkit-font-smoothing: antialiased;
		    -moz-osx-font-smoothing: grayscale;
		    content: "\e62b";
		    padding-right: 5px;
		}
	}
	.el-tree .el-tree-node__label:before {
	    font-family: 'iconfont'!important;
	    speak: none;
	    font-style: normal;
	    font-weight: 400;
	    font-variant: normal;
	    text-transform: none;
	    line-height: 1;
	    vertical-align: baseline;
	    display: inline-block;
	    -webkit-font-smoothing: antialiased;
	    -moz-osx-font-smoothing: grayscale;
	    content: "\e768";
	    color:#777;
	    padding-right: 5px;
	}
}
.staticResource{
	.upload-demo{
		.el-upload-list.el-upload-list--text{
		   width: 35%;
		    margin: auto;
		}
	}
	.el-tabs__header{
		margin-left: 15px;
	    margin-right: 15px;
	}
	.el-icon-d-arrow-right.bottom{
		transform:rotate(90deg);
		-ms-transform:rotate(90deg); 	/* IE 9 */
		-moz-transform:rotate(90deg); 	/* Firefox */
		-webkit-transform:rotate(90deg); /* Safari 和 Chrome */
		-o-transform:rotate(90deg); 
	}
	.el-icon-d-arrow-right.top{
		transform:rotate(-90deg);
		-ms-transform:rotate(-90deg); 	/* IE 9 */
		-moz-transform:rotate(-90deg); 	/* Firefox */
		-webkit-transform:rotate(-90deg); /* Safari 和 Chrome */
		-o-transform:rotate(-90deg); 
	}
	.tableList{
		color: #48576a;
		.checkList a:hover {
    		transform: scale(1,1.1);
    		color: #20a0ff;
		}
		.textDesc{
			text-align: center;
		    color: #666;
		    font-size: 14px;
		}
		.checkList:last-child{
			border-bottom: 0;
		}
		.checkList  {
			cursor: pointer;
		    height:52px;
		    line-height: 52px;
		    padding-left: 15px;
		    border-bottom: 1px solid #ddd;
		    color:#333;
		    font-size: 14px;
		    position: relative;
		    a{
		    	display: inline-block;
		    	max-width: 80%;
		    	overflow: hidden;
		    	text-overflow: ellipsis;
		    	color:inherit;
		    	text-decoration: none;
		    }
		}
		.statusDiv{
			text-align: right;
			font-size:14px;
			.statusCheck{
				height:15px;
				width:15px;
				border-radius: 4px;
				display:inline-block;
				margin-right: 10px;
				margin-left: 20px;
				background-color:#CCCCCC ;
				vertical-align: middle;
			}
		}
	}
}

title sapn.el-tag{
	padding: 0 3px;
    height: 18px;
    line-height: 18px;
    margin-left: 3px;
}
.el-message-box{
	 border-radius: 5px;
	 .el-message-box__btns{
	 	text-align: center;
	 }
}
</style>