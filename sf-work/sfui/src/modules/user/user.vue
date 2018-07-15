<template>
    <div class="user-page">
        <div class="user">
            <div class="user-left">
                <img :src="commentHeadImgUrl">
                <div class="head-decorate" v-if="headImageType !== ''">
                    <img :src="headDecorate" />
                </div>
                <span>{{applyUpName}}</span>
            </div>
            <div class="user-right">
                <router-link class="tab-item-text" to="/message">
                    <img @click="viewNotify" src="../../assets/images/comment1.png">
                    <span v-show="exitNotifyNum !== 0">{{exitNotifyNum}}</span>
                </router-link>                                     
            </div>
        </div>
        <v-tab :line-width="2" active-color='#f7c300' bar-active-color="#f7c300" :custom-bar-width="getBarWidth">
            <v-tab-item :selected='selectedItem==item' v-for="(item,key) in list"  @on-item-click="onItemClick(item)" :key="key">{{item}}</v-tab-item>
        </v-tab>
        <div v-if="selectedItem=='我的脸谱宣言'" class="my-declaration">
            <div class="already-delete" v-if="hotList.deleteSign === 'yes'">
                <div class="userPledge">
                    <div class="pledgeImg">
                        <img src="../../assets/images/haixuan.png">
                    </div>
                    <div class="pledgeTips">发表脸谱宣言，才能正式参加海选晋级哦！</div>
                    <router-link class="tab-item-text" to="/publishManifesto">
                        <div class="btnPublish">发表宣言</div>
                    </router-link>
                    
                </div>
            </div>
            <div v-else>
                <div class="userPledge" v-if="hotList.finishApply=='no'||hotList.finishApply==''||hotList.finishApply==null">
                    <div class="pledgeImg">
                        <img src="../../assets/images/haixuan.png">
                    </div>
                    <div class="pledgeTips">参与脸谱行动，展示最真的你！</div>
                    <router-link class="tab-item-text" to="/apply">
                        <div class="btnPublish">我要报名</div>
                    </router-link>
                    
                </div>
                <div class="userPledge" v-else-if="hotList.finishAudition=='no' || !hotList||hotList.finishAudition==''||hotList.finishAudition==null">
                    <div class="pledgeImg">
                        <img src="../../assets/images/haixuan.png">
                    </div>
                    <div class="pledgeTips">完成海选任务，才能发表脸谱宣言哦！</div>
                    <router-link class="tab-item-text" to="/audition">
                        <div class="btnPublish">完成海选任务</div>
                    </router-link>
                    
                </div>
                <div class="userPledge" v-else-if="hotList.finishManifesto=='no' || !hotList||hotList.finishManifesto==''||hotList.finishManifesto==null ">
                    <div class="pledgeImg">
                        <img src="../../assets/images/haixuan.png">
                    </div>
                    <div class="pledgeTips">发表脸谱宣言，才能正式参加海选晋级哦！</div>
                    <router-link class="tab-item-text" to="/publishManifesto">
                        <div class="btnPublish">发表宣言</div>
                    </router-link>
                    
                </div>
                <div class="item-container" v-else-if="hotList.finishManifesto === 'yes'">             
                    <div class="item">
                        <router-link :to="{name:'matchDetail',params:{uuid:hotList.uuid}}" class="content-wrap">
                            <v-flexbox>
                                <v-flexbox-item :span="4">
                                    <div class="item-img">
                                    <img :src="hotList.coverUrl">
                                    <!-- <div class="btnPlay">
                                            <img src="../../assets/images/play.png">
                                    </div> -->
                                    </div>
                                </v-flexbox-item>
                                <v-flexbox-item>
                                    <div class="item-content">
                                        <span class="video-state" :class="videoStateClass">{{stateText}}</span>
                                        <div class="item-content-usermsg">
                                            <img :src="commentHeadImgUrl">
                                            <div class="head-decorate" v-if="headImageType !== 0">
                                                <img :src="headDecorate" />
                                            </div>
                                            <!-- <span class="username">{{item.applyUpName}}</span>
                                            <span class="competition-area">{{item.regional}}</span> -->

                                        </div>
                                        
                                        <p>{{hotList.manifestoTitle}}</p>
                                        <v-flexbox :gutter="0" class="icon-wrap">
                                            <v-flexbox-item class="visit-item">
                                                <div class="flex-msg">
                                                    <div class="msg-icon">
                                                        <img slot="icon" class="icon1" src="../../assets/images/view.png">
                                                    </div>
                                                    <span>{{hotList.visitNum}}</span>
                                                </div>
                                            </v-flexbox-item>
                                            <v-flexbox-item>
                                                <div class="flex-msg">
                                                    <div class="msg-icon">
                                                        <img slot="icon" class="icon2" src="../../assets/images/comment.png">
                                                    </div>
                                                    <span>{{hotList.commentNum}}</span>
                                                </div>
                                            </v-flexbox-item>
                                            <v-flexbox-item>
                                                <div class="flex-msg">
                                                    <div class="msg-icon">
                                                        <img slot="icon" class="icon3" src="../../assets/images/love.png">
                                                    </div>
                                                    <span>{{hotList.likeNum}}</span>
                                                </div>
                                            </v-flexbox-item>
                                        </v-flexbox>

                                    </div>
                                </v-flexbox-item>
                            </v-flexbox>
                        </router-link>

                        <!-- <router-link class="tab-item-text" to="/publishManifesto">
                            <div class="btnPublish">重新发表宣言</div>
                        </router-link> -->
                        <router-link class="tab-item-text" to="/publishManifesto" v-if="hotList.publishStatus === 2">
                            <div class="btnPublish">重新发表宣言</div>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="selectedItem=='我的发表'" class="my-publish">
            <div class="pledgelist" v-show="postInfo.length !== 0">
                <div class="pledgeItem" v-for="(item, key) in postInfo" :key="key">
                    <router-link :to="{name:'communityDetail',params:{uuid:item.uuid}}">
                        <h3>{{item.manifestoTitle}}</h3>
                        <v-flexbox>
                            <v-flexbox-item :span="4">
                                <div class="pledgeMsg">
                                    <img src="../../assets/images/dianzan1.png">
                                    <span>{{item.likeNum}}</span>
                                </div>
                            </v-flexbox-item>
                            <v-flexbox-item :span="4">
                                <div class="pledgeMsg">
                                    <img src="../../assets/images/comment.png">
                                    <span>{{item.commentNum}}条互动</span>
                                </div>
                            </v-flexbox-item>
                            
                        </v-flexbox>
                    </router-link>
                </div>
            </div>
            <div class="no-data">没有更多数据了哦~</div>
        </div>
        <footer-component active="3"></footer-component>
        <loading v-show="isShowLoading"></loading>
    </div>
</template>

<script>
import Vue from 'vue';
import { Tab, TabItem } from 'sfmui'
Vue.component(Tab.name, Tab);
Vue.component(TabItem.name, TabItem);
import FooterComponent from '../../components/footer.vue'
export default {
    components:{
        FooterComponent
    },
    data() {
        return {
            applyUpName: '孙尚香',
            headImageType: '',
            getBarWidth:"70px",
            list:['我的脸谱宣言','我的发表'],
            selectedItem:'我的脸谱宣言',
            hotList:'',
            postInfo:'',
            exitNotify:localStorage.getItem('exitNotify'),
            // exitNotifyNum: sessionStorage.getItem('exitNotifyNum') ? sessionStorage.getItem('exitNotifyNum') : 0,
            exitNotifyNum: 0,
            applyUpNum: localStorage.getItem('applyUpNum'),
            isShowLoading: true,
            timer: null
        }
    },
    mounted(){
        this.getMineInfo();
        this.getMineData();
        this.getMinePost();
        this.queryExistMessageNotify();
        this.$setNavTitle('个人中心')
    },
    destroyed() {
        let that = this;
        clearInterval(that.timer);
        this.timer = null;
    },
    methods:{
        getMineInfo() {
            let that = this;
            this.$axios.post('/match/obtainuserApplyInfo')
            .then(function (res) {
                var data = res.data;
                that.applyUpName = data.result.applyUpName;
                that.headImageType = data.result.headImageType;
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        onItemClick(item){
            this.selectedItem = item;
        },
        getMineData:function(){
            let that = this;
            this.$axios.post('/mine/queryMineMatchInfo')
            .then(function (response) {
                that.hotList = response.data.result;
                if(that.hotList.deleteSign === 'yes') {
                    var isShowDeleteTips = sessionStorage.getItem('isShowDeleteTips');
                    if(!isShowDeleteTips) {
                        that.$Modal.alert.show({
                            title: '删除提示',
                            content: '您的宣言已被删除，请重新上传'
                        })
                        sessionStorage.setItem('isShowDeleteTips', true)
                    } else {}
                }
                if(that.hotList.publishStatus === 2) {
                    //视频审核被驳回
                    if(!sessionStorage.getItem('isShownReject')) {
                        that.$Modal.alert.show({
                            title: '您的宣言被驳回',
                            content: that.hotList.auditRemark
                        })
                        sessionStorage.setItem('isShownReject', true)
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        getMinePost:function(){
            let that = this;
            this.$axios.post('/mine/queryMinePostInfo')
            .then(function (response) {
                if(response.data.succ === 'ok') {
                    that.postInfo = response.data.result;
                    that.isShowLoading = false;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
       
        queryExistMessageNotify(){
            let that = this;
            this.$axios.post('mine/queryExistMessageNotify')
            .then(function (response) {
                if(response.data.succ === 'ok') {
                    var result = response.data.result
                    if(result !== 0) {
                        that.exitNotifyNum = result;
                        // sessionStorage.setItem('exitNotifyNum',that.exitNotifyNum);
                        that.timer = setTimeout(that.queryExistMessageNotify,20000);
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        viewNotify(){
            this.exitNotifyNum = 0;
            // sessionStorage.removeItem('exitNotifyNum');
            let that = this;
            clearInterval(that.timer);
            this.timer = null;
        } 
    },
    computed: {
        headDecorate() {
            if(this.headImageType === 1) {
                return require("../../assets/images/avatar1.png")
            } else if(this.headImageType === 2) {
                return require("../../assets/images/avatar2.png")
            } else if(this.headImageType === 3) {
                return require("../../assets/images/avatar3.png")
            }
        },
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + this.applyUpNum + '.jpg';
        },
        videoStateClass() {
            if(this.hotList.publishStatus === 0) {
                return 'auditing' //审核中
            } else if(this.hotList.publishStatus === 1) {
                return 'success' //审核通过
            } else if(this.hotList.publishStatus === 2) {
                return 'fail' //审核驳回
            }
        },
        stateText() {
            if(this.hotList.publishStatus === 0) {
                return '审核中' //审核中
            } else if(this.hotList.publishStatus === 1) {
                return '审核通过' //审核通过
            } else if(this.hotList.publishStatus === 2) {
                return '宣言被驳回' //审核驳回
            }
        }
    }
}
</script>

<style lang='less' scoped>
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 12px;
    padding: 20px 0;
}
.my-declaration{
    margin-top: 6px;
}
.visit-item .msg-icon{
    margin-right: 5px;
}
.flex-msg{
    padding: 5px 0px;
    text-align: center;
    .msg-icon{
        display: inline-block;
        width: 23px;
        height: 16px;
        .icon1{
            width: 26px;
            margin-right: 4px;
        }
        .icon2{
            width: 22px;
        }
        .icon3{
            width: 20px;
        }
    }
  
    img{
        width: 100%;
        height: auto;
        display: inline-block;
        vertical-align: middle;
    }
    span{
        font-size: 12px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        color: #878787;
       

    }
}
.item{
    padding: 10px;
    background: white;
}
.item-img{
    height: 105px;
    position: relative;
    overflow: hidden;
    img{
        width: 200%;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
    .btnPlay{
        position: absolute;
        top: 60%;
        left: 60%;
        width: 25px;
        height: 25px;
        margin-left: -25px;
        margin-top: -25px;
        img{
            width: 100%;
            height: 100%;
        }
        
    }

}
.item-container{
    .btnPublish{
        font-size: 18px;
        height: 45px;
        border-radius: 5px;
        line-height: 45px;
        text-align: center;
        color: white;
        background: #f7c300;
        width: 50%;
        margin: 40px auto 30px;
     }
}
.item-content{
    position: relative;
    height: 105px;
    
    .video-state{
        position: absolute;
        padding: 0 4px;
        font-size: 14px;
        right: 10px;
        top: 0;
        color: #fff;
        border-radius: 2px;
        &.success{
            background-color: #67C23A;
        }
        &.fail{
            background-color: #F56C6C;
        }
        &.auditing{
            background-color:#E6A23C;
        }
    }
    .item-content-usermsg{
        position: relative;
        margin-left: 10px;
        .head-decorate{
                position: absolute;
                top: -8px;
                left: -6px;
                img{
                    width: 36px;
                    height: auto;
                }
            }
        img{
            width: 25px;
            height: 25px;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            
        }
        .username{
            color: #878787;
            margin-right: 10px;
        }
        .competition-area{
            background: #4394f4;
            color: white;
            padding: 0 5px;
        }
        
    }
    p{
        color: #333;
        font-size: 1.25em;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 10px;
        margin-left: 10px;
        margin-top: 5px;
        word-break: break-word;
    }
    .icon-wrap{
        position: absolute;
        bottom: -10px;
    }
}
.sfmui-tab[data-v-fc803c82]{
    height: 45px !important;
}
 .user{
     height: 80px;
     width: 100%;
     background: #f7c300;
     display: flex;
     display: -webkit-flex;
     .user-left{
        position: relative;
        width: 50%;
        margin-left: 15px;
        line-height: 80px;
        .head-decorate{
            position: absolute;
            top: -2px;
            left: -8px;
            img{
                width: 65px;
                height: auto;
            }
        }
        img{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            vertical-align: middle;
            margin-right: 15px;
        }
        span{
            font-size: 16px;
            color: white;
        }
     }
     .user-right{
          width: 50%;
            margin-left: 15px;
            text-align: right;
            line-height: 80px;
            a{
                position: relative;
                img{
                    width: 28px;
                    height: 20px;
                    vertical-align: middle;
                    margin-right: 15px;
                }
                span{
                    min-width: 16px;
                    min-height: 16px;
                    border-radius: 50%;
                    background: red;
                    position: absolute;
                    top: -6px;
                    right: 9px;
                    font-size: 10px;
                    text-align: center;
                    line-height: 16px;
                    color: #fff;
                }
            }
         
     }
 }
 .userPledge{
     width:100%;
     height: 100%;
     background: white;
     margin-top: 6px;
     padding: 10px;
     .pledgeImg{
         width: 100px;
         height: 100px;
        

         margin: 10px auto;
         img{
             width: 100%;
             height: 100%;
             vertical-align: middle
         }
     }
     .pledgeTips{
         font-size: 14px;
         color: #999;
         text-align: center;
     }
     .btnPublish{
        font-size: 18px;
        height: 45px;
        border-radius: 5px;
        line-height: 45px;
        text-align: center;
        color: white;
        background: #f7c300;
        width: 50%;
        margin: 30px auto;
     }
     
 }
 .my-publish{
     position: absolute;
     width: 100%;
     top: 125px;
     bottom: 53px;
     margin: auto;
     overflow: auto;
 }
 .pledgelist{
     width:100%;
     height: auto;
     background: white;
     margin-top: 6px;
     .pledgeItem{
        box-sizing: border-box;
        padding: 10px 14px;
        border-bottom: 1px solid #e6e6e6;
        h3{
            font-size: 16px;
            margin-bottom: 10px;
        }
     .pledgeMsg{
       
         img{
            width: 20px;
            height: auto;
            vertical-align: middle;
         }
         span{
             display: inline-block;
             color: #878787;
             text-align: center;
             position: relative;
            top: 1px;
         }
     }

     }
     
 }
</style>

