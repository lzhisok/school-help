<template>
    <div>
        <div class="area-select">
            <v-group title="" label-width="5em">
                <v-popup-picker :data="matchAreaOption" title="赛区选择" :rows="5" v-model="value4" show-name :columns="2" @on-change="onChange" placeholder="请选择"></v-popup-picker>
            </v-group>

        </div>
        <div class="rank-container">
            <div class="rank-item" v-if="rankOne.length !== 0">
                <v-flexbox>
                        <v-flexbox-item :span="2">
                            <div class="rank rank-number">
                                <img src="../../assets/images/rank1.png">
                             </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="5">
                            <div class="rank">
                                <img :src='commentHeadImgUrl(rankOne.applyUpNum)'>
                                <span>{{rankOne.applyUpName}}</span>
                            </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="4">
                            <div class="rank-dz">
                                <span>{{rankOne.likeNum}}</span>
                                <img src="../../assets/images/heart2.png">
                             </div>
                        </v-flexbox-item>
                    </v-flexbox>
            </div>
            <div class="rank-item" v-if="rankTwo.length !== 0">
                <v-flexbox>
                        <v-flexbox-item :span="2">
                            <div class="rank rank-number">
                                <img src="../../assets/images/rank2.png">
                             </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="5">
                            <div class="rank">
                                <img :src='commentHeadImgUrl(rankTwo.applyUpNum)'>
                                <span>{{rankTwo.applyUpName}}</span>
                            </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="4">
                            <div class="rank-dz">
                                <span>{{rankTwo.likeNum}}</span>
                                <img src="../../assets/images/heart2.png">
                             </div>
                        </v-flexbox-item>
                    </v-flexbox>
            </div>
             <div class="rank-item" v-if="rankThree.length !== 0">
                <v-flexbox>
                        <v-flexbox-item :span="2">
                            <div class="rank rank-number">
                                <img src="../../assets/images/rank3.png">
                             </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="5">
                            <div class="rank">
                                <img :src='commentHeadImgUrl(rankThree.applyUpNum)'>
                                <span>{{rankThree.applyUpName}}</span>
                            </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="4">
                            <div class="rank-dz">
                                <span>{{rankThree.likeNum}}</span>
                                <img src="../../assets/images/heart2.png">
                             </div>
                        </v-flexbox-item>
                    </v-flexbox>
            </div>
            <div class="rank-item" v-if="rankList" v-for="(item, key) in rankList" :key="key">
                <v-flexbox>
                        <v-flexbox-item :span="2">
                            <div class="rank rank-number">
                               <span>{{key+4}}</span>
                             </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="5">
                            <div class="rank">
                                <img :src='commentHeadImgUrl(item.applyUpNum)'>
                                <span>{{item.applyUpName}}</span>
                            </div>
                        </v-flexbox-item>
                        <v-flexbox-item :span="4">
                            <div class="rank-dz">
                                <span>{{item.likeNum}}</span>
                                <img src="../../assets/images/heart2.png">
                             </div>
                        </v-flexbox-item>
                    </v-flexbox>
            </div>
        </div>
        <div class="no-data">没有更多数据了哦~</div>
        <loading v-show="isShowLoading"></loading>
        <footer-component active="2"></footer-component>
    </div>
</template>

<script>
import Vue from 'vue';
import { PopupPicker } from 'sfmui';
import { Group } from 'sfmui';

Vue.component(Group.name, Group);
Vue.component(PopupPicker.name, PopupPicker);
import FooterComponent from '../../components/footer.vue'
export default {
    components:{
        FooterComponent
    },
    data() {
        return {
            totalDivision: localStorage.getItem('totalDivision'),
            regional: localStorage.getItem('regional'),
            rankOne: [],
            rankTwo: [],
            rankThree: [],
            rankList: [],
            value4: [localStorage.getItem('totalDivision') + '1', localStorage.getItem('regional')],
            // value4: ['华东大区', '上海区'],
            matchAreaOption: [],
            isShowLoading: true
        }
    },
    mounted(){
        let that = this;
        this.getRank();
        this.$setNavTitle('排行');
        setTimeout(function() {
            var largeArea = that.$dicTool().getSeletList('match_type');
            if(largeArea !== null) {
                largeArea.forEach((item, index) => {
                    var matchArea = that.$dicTool().getSeletList('match_type.' + largeArea[index].value);
                    item.value = item.label + '1';
                    item.name = item.label;
                    matchArea.forEach((childItem, childIndex) => {
                        childItem.parent = item.value;
                        childItem.name = childItem.label;
                        childItem.value = childItem.label;
                        largeArea.push(childItem)
                    })
                });
            }
            that.matchAreaOption = largeArea;
        })
    },
    methods: {
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        onChange(value) {
            console.log(value)
            this.totalDivision = value[0].substring(0, value[0].length - 1);
            this.regional = value[1];
            console.log(this.totalDivision, this.regional)
            this.getRank();
        },
        getRank:function(){
            let that = this;
            this.$axios.post('match/matchTopInfo',{
                "regional": this.regional,
                "totalDivision": this.totalDivision
            })
            .then(function (response) {
                let datalist = [];
                var list = response.data.result;
                if(response.data.succ === 'ok') {
                    if(list == null) {
                        that.rankOne = [];
                        that.rankTwo = [];
                        that.rankThree = [];
                        that.rankList = [];
                        that.isShowLoading = false;
                        return;
                    }
                    if(list.length !== 0) {
                        if(list.length === 1) {
                            that.rankOne = list[0];
                        }  else if(list.length === 2) {
                            that.rankOne = list[0];
                            that.rankTwo = list[1];
                        } else if(list.length === 3) {
                            that.rankOne = list[0];
                            that.rankTwo = list[1];
                            that.rankThree = list[2];
                        } else {
                            that.rankOne = list[0];
                            that.rankTwo = list[1];
                            that.rankThree = list[2];
                            that.rankList = list.slice(3);
                        }
                    } else {
                        that.rankOne = [];
                        that.rankTwo = [];
                        that.rankThree = [];
                        that.rankList = [];
                    }
                    that.isShowLoading = false;
                }
                
            })
            .catch(function (error) {
                console.log(error);
            });
      }

    }
}
</script>

<style lang='less' scoped>
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 14px;
    margin-top: 20px;
    padding-bottom: 20px;
}
.sfmui-no-group-title {
    margin-top: 0!important;
}
.sfmui-flexbox {
    width: 100%;
    text-align: left;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    display: -webkit-flex !important;
    // box-align: center !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
}
.area-select{
    width: 100%;
    background: white;
}
.rank-container{
    margin: 20px 0px;
    background: white;
    .rank-item{
        padding: 10px;
        width: 100%;
        border-bottom: 1px solid #e6e6e6;
        .rank{

            img{
                width: 45px;
                height: 45px;
                border-radius: 50%;
                vertical-align: middle;

            }
            span{
                color: #878787;
                font-size: 14px;
            }
        }
        .rank-dz{
            text-align: right;
            img{
                width: 25px;
                height: 22px;
                vertical-align: middle;
            }
            span{
                color: #f1173b;
                font-size: 14px;
            }
        }
        .rank-number{
            text-align: center;
        img{
            margin-top: 15px;
        }
        span{
            font-size: 28px;
        }
        
        }
    }

}


</style>

