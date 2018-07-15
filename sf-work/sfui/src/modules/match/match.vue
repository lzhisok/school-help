<template>
    <div>
        <v-flexbox :gutter="0" class="tab">
            <v-flexbox-item class="tab-item">
                <router-link class="tab-item-text" to="/match/matchHot">热门</router-link>
            </v-flexbox-item>
            <v-flexbox-item class="tab-item">
                <router-link class="tab-item-text" to="/match/matchNew">最新</router-link>
            </v-flexbox-item>
        </v-flexbox>
        <div class="match-main">
			<router-view class="router-view"></router-view>
		</div>
        <footer-component active="0"></footer-component>
        <loading v-show="isShowLoading"></loading>			
    </div>
</template>

<script>
import FooterComponent from '../../components/footer.vue'
export default {
    components:{
        FooterComponent
    },
    data() {
        return {
            title: '赛事',
            money: 1521.25,
            isShowLoading: false
        }
    },
    filters: {
        formatMoney:function() {
            return arguments[1]
        }
    },
    mounted() {
        this.$setNavTitle('赛事');
    }
}
</script>

<style lang="less" scoped>
.sfmui-flexbox{
    align-items: flex-end;
}
.tab {
    height: 52px;
    background-color: #fff;
    .tab-item{
        text-align: center;
        font-size: 16px;
        color: #000;
        .tab-item-text{
            display: inline-block;
            padding-bottom: 8px;
            border-bottom: 2px solid transparent;
        }
        .tab-item-text.router-link-active{
            color: #f7c300;
            border-bottom-color: #f7c300;
        }
    }
}
.match-main{
    position: absolute;
    width: 100%;
    bottom: 53px;
    top: 52px;
    margin: auto;
    height: auto;
}
</style>


