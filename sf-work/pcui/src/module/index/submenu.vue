<template>
	<el-submenu :index="item.moduleCode">

		<!--第一层菜单-->
		<template slot="title">
			<i :class="item.moduleIcon"></i>
			<span class="menu-level">{{ item.moduleName }}<span v-if="item.badge>0">（{{item.badge}}）</span>
			</span>
		</template>

		<template v-for="(itemSub,indexSub) in item.childModules">
			<el-menu-item v-if="itemSub.childModules.length===0" class="menu-level" :index="itemSub.moduleCode" :key="indexSub" @click.native="selected(itemSub.moduleName, itemSub.moduleId)">
				<span>{{ itemSub.moduleName }}</span><span v-if="itemSub.badge>0">（{{itemSub.badge}}）</span>
			</el-menu-item>

			<submenu v-else class="menu-level" :item="itemSub" :key="indexSub" @selected="selected" />
		</template>

	</el-submenu>
</template>
<script>
	export default {
		name: 'submenu',
		props: ['item'],
		methods: {
			selected(tab, moduleId) {
				this.$emit('selected', tab, moduleId)
			}
		}
	}
</script>