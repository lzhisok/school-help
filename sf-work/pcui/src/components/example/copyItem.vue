<template>
	<!--赋值到粘贴板-->
  <span class="copyItem"  v-clipboard:copy="path" ><i class="copyLink" ></i>复制链接</span>
</template>

<script>
export default {
  name: 'copyItem',
  props: [
		'path'
	],
  data () {
    return {
    	
    }
  },
  method:{
  	onCopy (e) {
      console.log('You just copied: ' + e.text)
    },
    onError (e) {
      console.log('Failed to copy texts')
    },
  }
}
</script>
<style scoped>
.copyLink{
	display: inline-block;
	width:12px;
	height:12px;
	background-image: url(../../common/images/link.png);
	background-size: 100% 100%;
	background-repeat: no-repeat;
	margin-bottom: -2px;
    margin-right: 2px;
}
.copyItem{
	font-size: 12px;
    color: #767676;
} 
</style>
