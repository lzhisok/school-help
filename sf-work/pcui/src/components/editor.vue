<!--
 *@author：weihui
 *@pramas: 
  * "v-model",string,初始化的数据,必填无默认
  * "disabled",boolean,是否禁用，非必填默认false
  * "editable",boolean,是否可编辑,不可编辑状态下的富文本框只具有展示功能,非必填默认true
  * "@getText",function，函数接受一个参数可获取正在编辑的富文本框的内容，其值等同于v-model传入的变量，非必填无默认
 -->
<template>
    <div></div>
</template>
<script>
    import Wangeditor from 'wangeditor'
    import _ from 'underscore'
    
    export default {
	    name: 'soEditor',
	
	    componentName: 'soEditor',
	
	    props: [
		 	'value',
		    'disabled',
		    'editable'
	    ],
	    data() {
	    	return {
	    		tempVal: '',
				inited: false
	    	}
	    },
	    computed:{
	    	editableVal(){//默认菜单显示
	    		return this.editable == undefined?true:this.editable;
	    	},
	    	disabledVal(){//默认可编辑
	    		return this.disabled == undefined?false:this.disabled;
	    	}
	    },
	    watch: {
	  		value(val) {//传入参数
				this.tempVal = val;
	  			if (!this.inited && (val || val == '')) {
					this.editor.$txt.html(val);
	  				this.inited = true;
	  			}
		  	},
			tempVal(val) {//双向绑定
				this.$emit('input', val);
			},
			editableVal(val) {//设置菜单可见状态
				this.setEditable(val);
			},
			disabledVal(val) {//设置可编辑状态
				this.setdisabled(val);
			}
		},
	    mounted () {
		    this.editor = new Wangeditor(this.$el);
			
			this.setEditable(this.editableVal);//初始化菜单显示
			
			this.setdisabled(this.disabledVal);//初始化可编辑状态
		    		    
		    this.editor.onchange = _.debounce(() => {
				this.tempVal = this.editor.$txt.html();
		    	this.$emit('getText', this.editor.$txt.text());
		    }, 300)
		    
		    this.editor.create();
	    },
		methods: {
			setEditable(flag) {
				if(!flag){
					this.editor.config.menus = [];
				}else{
					this.editor.config.menus = [
						'bold',
						'underline',
						'italic',
						'strikethrough',
						'eraser',
						'forecolor',
						'bgcolor',
						'quote',
						'fontfamily',
						'fontsize',
						'head',
						'unorderlist',
						'orderlist',
						'alignleft',
						'aligncenter',
						'alignright',
						'link',
						'unlink',
						'table',
						'emotion',
						'img',
						'undo',
						'redo',
						'fullscreen'
					];
				}
			},
			setdisabled(val) {
		  		if (!!val) {
					this.editor.disable();
				} else {
					this.editor.enable();
				}
			}
		},
	    destroyed () {
	        this.editor.destroy();
	    }
    }
</script>
