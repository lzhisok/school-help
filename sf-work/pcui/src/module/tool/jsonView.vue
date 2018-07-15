<template>
	<div class="getJson">
		<el-row>
			<el-col :span="8">
				<el-input v-model="searchHttp" placeholder="接口搜索" class="selectHttp">
					<!--<el-select v-model="selectHttp" slot="prepend" placeholder="请选择" @change="changeHttp">
				      <el-option :label="item.http" :value="item" v-for="item in httpList"></el-option>
				    </el-select>-->
				</el-input>
				<div class="nav">
					<el-collapse v-model="activeName" :accordion="true" v-for="(item,index) in pathList" @change="changeCollapse" :key="index">
						<el-collapse-item :title="item.path" :name="index">
							<pre>{{item.param}}</pre>
						</el-collapse-item>
					</el-collapse>
				</div>
			</el-col>

			<el-col :span="16" class="jsonview">
				<div class="urlinput">
					<!--<el-input v-model="http" placeholder="http://localhost:8080/" class="urlbefore"></el-input>-->
					<el-input v-model="url" placeholder="http://localhost:8080/admin/checkLogin" class="urlafter"></el-input>
					<el-button @click="run" type="primary">运行</el-button>
				</div>

				<div class="vieweditor">
					<so-jsoneditor :isGet="isGet" :mode="pEditorMode" :myJson="param" @getJson="getJson"></so-jsoneditor>
				</div>
				<div class="vieweditor">
					<so-jsoneditor :mode="rEditorMode" :myJson="responseData"></so-jsoneditor>
				</div>

			</el-col>
		</el-row>

	</div>
</template>

<script>
	import {
		ElCollapse,
		ElCollapseItem,
		Message
	} from 'element-ui';
	import soJsoneditor from '../../components/jsonEditor.vue';

	export default {
		data() {
			return {
				pEditorMode: 'code',
				rEditorMode: 'tree',
				loaded: false,
				responseData: '',
				param: {},
				isGet: false,
				http:'',
				url: '',
				httpList:[],
				selectHttp:'',
				pathList:[],
				allPathList:[],
				activeName:'0',
				searchHttp:'',
			}
		},
		beforeCreate() {},
		mounted() {
			this.httpList = this.$localStorage.get('httpObjects');
			this.showUrl();
		},
		computed: {},
		localStorage:{
			httpObjects:{
				type:Array,
				default:[]
			},
		    urlObjects:{
		    	type:Array,
		    	default:[]
		    },
		    jsonObjects:{
		    	type:Array,
		    	default:[]
		    }
		},
		methods: {
			run() {
				/*if(this.http=='') {
					Message({
						message: '请求头不能为空！',
						type: 'warning'
					});
					return;
				}*/
				if(this.url=='') {
					Message({
						message: '接口不能为空！',
						type: 'warning'
					});
					return;
				}
				this.loaded = true;
				let that = this;
				this.changeCallGet();
				setTimeout(function(){
					var obj = that.extendDeepCopy(that.param);
					that.$http.post(that.url+'?_SO=1', that.param).then(function(response) {
						that.loaded = false;
						that.responseData = response;
						//that.getLocalStorageHttp(that.http);
						that.getLocalStorageUrl(that.url,obj);
						this.isGet = false;
					}, function(response) {
						that.responseData = response;
						that.loaded = false;
						this.isGet = false;
					});
				},100);
			},
			getJson(jsonData) {
				this.param=jsonData;
			},
			changeCallGet() {
				this.isGet = true;
			},
			/*getLocalStorageHttp(http){//获取相同请求头
				let flag=false;
				let httpObjects = this.$localStorage.get('httpObjects');
				if(httpObjects==null) return;
				for(var i=0;i<httpObjects.length;i++){
					if(httpObjects[i].http==http){
						flag = true;
						break;
					}
				}
				if(!flag){
					var obj = {
						http:http
					}
					httpObjects.push(obj);
					this.httpList.push(obj);
					this.$localStorage.set('httpObjects',httpObjects);
				}
				return flag;
			},*/
			getLocalStorageUrl(url,param){//获取相同接口
				let flag=false;
				let urlObjects = this.$localStorage.get('urlObjects');
				if(urlObjects==null) return;
				for(var i=0;i<urlObjects.length;i++){
					if(urlObjects[i].path==url){
						flag = true;
						urlObjects[i].path=url;
						urlObjects[i].param=param;
						break;
					}
				}
				this.$localStorage.set('urlObjects',urlObjects);
				if(!flag){
					var obj={
						path:url,
						param:param
					}
					urlObjects.push(obj);
					this.$localStorage.set('urlObjects',urlObjects);
					this.showUrl();
					//this.changeHttp(this.selectHttp);
				}
				return flag;
			},
			/*changeHttp(val){
				//选择不同的http请求头查询出不同的接口
				this.allPathList = [];
				this.pathList = [];
				let list = this.$localStorage.get('urlObjects');
				if(list==null) return;
				for(var i=0;i<list.length;i++){
					if(list[i].http==val.http){
						this.allPathList.push(list[i]);
					}
				}
				this.pathList = this.allPathList;
			},*/
			showUrl(){
				//this.allPathList = [];
				this.pathList = this.$localStorage.get('urlObjects');
				this.allPathList = this.$localStorage.get('urlObjects');
			},
			extendDeepCopy(obj,newobj){
				var newobj = newobj||{};
				for(var i in obj){
					if(typeof obj[i]=='object'){
						newobj[i]=(obj[i].constructor===Array)?[]:{};
						extendDeepCopy(obj[i],newobj[i]);
					}else{
						newobj[i]=obj[i];
					}
				}
				return newobj;
			},
			changeCollapse(activeNames){
				if(activeNames=='') return;
				//this.http = this.pathList[activeNames].http;
				this.url = this.pathList[activeNames].path;
				this.param = this.pathList[activeNames].param;
			},
			filterHttp(val,oldVal){//过滤请求列表
				var list = this.allPathList;
				var results = val ? list.filter(this.createFilter(val)):list;
				this.pathList = results;
			},
			createFilter(queryString){
				return (restaurant) => {
		          	return (restaurant.path.indexOf(queryString) === 0);
		        };
			}
		},
		components: {
			soJsoneditor
		},
		watch:{
			searchHttp:'filterHttp'
		}
	}
</script>

<style lang="less">
.getJson{
	.nav {
		background: #f5f6fa;
		height: 500px;
		margin-left: -1px;
		border: 1px solid #e0e6ed;
		overflow: auto;
		position: relative;
		.el-collapse{
			.el-collapse-item__header{
				overflow: hidden;
			    word-break: break-all;
			    white-space: nowrap;
			    text-overflow: ellipsis;
			}
		}
	}
	.el-row {
		margin-bottom: 20px;
		&:last-child {
			margin-bottom: 0;
		}
	}
	
	.el-col {
		border-radius: 4px;
	}
	
	.bg-purple-dark {
		background: #99a9bf;
	}
	
	.bg-purple {
		background: #d3dce6;
	}
	
	.bg-purple-light {
		background: #e5e9f2;
	}
	
	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}
	
	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}
	.urlinput{
		display: flex;
		margin-bottom: 3px;
		.urlbefore{
			width: 240px;
			input{
				border-right: 0;
				background-color: #f3f3f3;
			}
		}
		
	}
	.selectHttp{
		.el-input-group__prepend{
			width: 160px !important;
		}
	}
	.jsonview{
		.vieweditor{
			div.jsoneditor-tree{
				min-height: 200px;
			}
		}
	}
}
</style>