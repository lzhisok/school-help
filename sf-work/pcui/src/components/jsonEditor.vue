<template>
</template>
<script>
	import jsonTree from "./../common/js/jsonTree.js"
	import './../common/css/jsonTree.css'
	export default {
		name: 'soJsoneditor',
		props: [
			'realResp',
			'myJson'
		],
		data() {
			return {
			}
		},
		watch: {
			myJson: 'setJson',
			realResp:'setRealResp'
		},
		mounted() {
			this.setJson();
			this.setRealResp();
		},
		methods: {
			setRealResp(){
				let wrapper = this.$el;
				wrapper.innerHTML = '';
				let jsonStr = this.realResp ? this.realResp:'{}';
				jsonStr = JSON.parse(jsonStr);
				let tree = jsonTree.create(jsonStr, wrapper);
				tree.expand(function(node) {
					return node.childNodes.length < 2 || node.label === 'phoneNumbers';
				})
			},
			setJson() {
				let wrapper = this.$el;
				wrapper.innerHTML = '';
				let jsonStr = this.myJson ? this.myJson:'{}';
				jsonStr = JSON.parse(jsonStr);
				let tree = jsonTree.create(jsonStr, wrapper);
				tree.expand(function(node) {
					return node.childNodes.length < 2 || node.label === 'phoneNumbers';
				})
			}
		 
		}
	}
</script>