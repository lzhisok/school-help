<template>
	<div class="dicTool">
		<el-select v-if="type=='select'" v-model="val">
		 	<el-option v-for="(item,index) in list" :key="index" :label="item.label" :value="item.value" ></el-option>
		</el-select>
		<el-checkbox-group v-if="type=='checkbox'" v-model="val">
	      	<el-checkbox v-for="(item,index) in list" :key="index" :label="item.value">{{item.label}}</el-checkbox>
	    </el-checkbox-group>
	    <el-radio-group v-if="type=='radio'" v-model="val">
		    <el-radio v-for="(item,index) in list"  :key="index" :label="item.value">{{item.label}}</el-radio>
		</el-radio-group>
	</div>
</template>

<script>
	export default {
		name: 'soDic',
		props: [
			'type',
			'value',
			'path',
			'selFirst'
			],
		data() {
			let val = this.value
			return {
				val,
				list:[]
			}
		},
		watch: {
			path:'searchList',
			val(val) {
				this.$emit('input', val)
			},
			value(val) {
				this.val = val
			}
		},
		mounted() {
			this.searchList();
		},
		methods: {
			searchList(){
				var sel='';
				if(this.type=='select'){
					if(this.selFirst==undefined){
						this.list = this.$dicTool().getSeletList(this.path);
					}else{
						sel = this.selFirst;
						this.list = this.$dicTool().getSeletList(this.path,sel);
					}
				}else{
					this.list = this.$dicTool().getSeletList(this.path);
				}
			}
		}
	}
</script>
<style type="text/css">
</style>