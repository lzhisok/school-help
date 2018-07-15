<template>
    <div>
        <v-flexbox :gutter="0" class="tab">
            <v-flexbox-item class="tab-item">
                <router-link class="tab-item-text" to="/community/communityHot">热门</router-link>
            </v-flexbox-item>
            <v-flexbox-item class="tab-item">
                <router-link class="tab-item-text" to="/community/communityNew">最新</router-link>
            </v-flexbox-item>
        </v-flexbox>
        <div class="match-main">
			<router-view class="router-view"></router-view>
            <div class="add-btn">
                <router-link class="tab-item-text" to="/publishPost">
                    <div class="addimg">
                        <img src="../../assets/images/add.png">
                    </div>
                </router-link>
            </div>
		</div>
       
         <footer-component active="1"></footer-component>
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
            title: '社区',
            money: 1521.25
        }
    },
    filters: {
        formatMoney:function() {
            return arguments[1]
        }
    },
    mounted() {
        this.$setNavTitle('社区')
    }
}
</script>

<style lang="less" scoped>
.add-btn{
    position: absolute;
    bottom: 20px;
    right: 10px;
    z-index: 232;
    .addimg{
        width: 60px;
        height: 60px;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
    }
}
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


