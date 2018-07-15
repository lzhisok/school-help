<template>
    <div class="match-hot" ref="matchHot">
        <v-flexbox :gutter="0">
            <v-flexbox-item>
                <router-link class="tab-item-text" to="/apply">
                    <div class="flex-item-tab">
                    <img slot="icon" src="../../assets/images/enroll.png">
                    <span>我要报名</span>
                </div>
                </router-link>
                
            </v-flexbox-item>
            <v-flexbox-item>
        
                <router-link class="tab-item-text" to="/matchRule">
                    <div class="flex-item-tab">
                        <img slot="icon" src="../../assets/images/ruler.png">
                        <span>赛事规则</span>
                    </div>
                </router-link>
                    
               
            </v-flexbox-item>
            
        </v-flexbox>
        <!--  -->
        <div class="block-head" v-if="hotOne !== null">
            <div @click="toDetail(hotOne.uuid)">
                <div class="block-head-main">
                    <span class="official-symbol">官方</span>
                    <div class="block-img">
                        <img :src="hotOne.coverUrl">
                    </div>
                    <div class="block-text">
                        <span class="text-title">{{hotOne.manifestoTitle}}</span>
                        <span class="regional" v-if="hotOne.regional">{{hotOne.regional}}</span>
                        
                    </div>
                    <!-- <div class="btn-play">
                        <img src="../../assets/images/play.png">
                    </div> -->

                </div>
                <v-flexbox :gutter="0">
                    <v-flexbox-item class="visit-item">
                        <div class="flex-msg">
                            <div class="msg-icon">
                                <img slot="icon" class="icon1" src="../../assets/images/view.png">
                            </div>
                            <span>{{hotOne.visitNum}}</span>
                        </div>
                    </v-flexbox-item>
                    <v-flexbox-item>
                        <div class="flex-msg">
                            <div class="msg-icon">
                                <img slot="icon" class="icon2" src="../../assets/images/comment.png">
                            </div>
                            <span>{{hotOne.commentNum}}</span>
                        </div>
                    </v-flexbox-item>
                    <v-flexbox-item>
                        <div class="flex-msg">
                            <div class="msg-icon" @click.stop="toggleLike(hotOne.yetLike, hotOne.uuid, 'hotOne')">
                                <img slot="icon" class="icon3" :src="hotOne.yetLike | likeIcon">
                            </div>
                            <span>{{hotOne.likeNum | filterLikeNum(hotOne.yetLike)}}</span>
                        </div>
                    </v-flexbox-item>
                </v-flexbox>
            </div>
        </div>
        <!-- 赛事列表 -->
        <div class="item-container">
            <div class="item-title">
                脸谱赛事
            </div>
            <div class="item" v-for="(item, key) in hotList" :key="key" v-if="hotList.length !== 0" @click="toDetail(item.uuid)">
                <div :to="{name:'matchDetail',params:{uuid:item.uuid}}">
                    <v-flexbox>
                        <v-flexbox-item :span="4">
                            <div class="item-img">
                                <img :src="item.coverUrl">
                                <!-- <div class="btnPlay">
                                    <img src="../../assets/images/play.png">
                                </div> -->
                            </div>
                        </v-flexbox-item>
                        <v-flexbox-item>
                            <div class="item-content">
                                <div class="item-content-usermsg">
                                    <img :src='commentHeadImgUrl(item.applyUpNum)'>
                                    <div class="head-decorate" v-if="item.headImageType !== 0">
                                        <img :src="headDecorate(item.headImageType)" />
                                    </div>
                                    <span class="username-match-hot">{{item.applyUpName}}</span>
                                    <span class="competition-area">{{item.regional}}</span>
                                </div>
                                <p>{{item.manifestoTitle}}</p>
                                <v-flexbox :gutter="0" class="icon-wrap">
                                    <v-flexbox-item class="visit-item">
                                        <div class="flex-msg">
                                            <div class="msg-icon">
                                                <img slot="icon" class="icon1" src="../../assets/images/view.png">
                                            </div>
                                            <span>{{item.visitNum}}</span>
                                        </div>
                                    </v-flexbox-item>
                                    <v-flexbox-item>
                                        <div class="flex-msg">
                                            <div class="msg-icon">
                                                <img slot="icon" class="icon2" src="../../assets/images/comment.png">
                                            </div>
                                            <span>{{item.commentNum}}</span>
                                        </div>
                                    </v-flexbox-item>
                                    <v-flexbox-item>
                                        <div class="flex-msg">
                                            <div class="msg-icon" @click.stop="toggleLike(item.yetLike, item.uuid, key)">
                                                <img slot="icon" class="icon3"  :src="item.yetLike | likeIcon">
                                            </div>
                                            <span>{{item.likeNum}}</span>
                                        </div>
                                    </v-flexbox-item>
                                </v-flexbox>

                            </div>
                        </v-flexbox-item>
                    </v-flexbox>
           
                </div>           
            </div>           
        </div>
        <div class="no-data">没有更多数据了哦~</div>
        <loading v-show="isShowLoading"></loading>
    </div>
</template>

<script>

export default {
    data() {
        return {
            isShowLoading: true,
            currentPage: 1,
            pageSize: 15,
            canScroll: true,
            hotList: [],
            hotOne: null,
            // hotList: [
            //     {
            //         uuid: '12201',
            //         applyUpName: '李明明',
            //         regional: '广州赛区',
            //         manifestoTitle: '平凡的岗位，不平凡的坚守',
            //         visitNum: '21130',
            //         commentNum: '211',
            //         likeNum: '211'
            //     }
            // ],
            // hotOne:{
            //     manifestoTitle: '致不平凡的自己',
            //     regional: '广州赛区',
            //     visitNum: 21130,
            //     commentNum: 211,
            //     likeNum: 211
            // }

        }
    },
    mounted(){
        let that = this;
        this.getOfficialVideo();
        this.getHotData();
        setTimeout(function() {
            that.getMineInfo();
        }, 100)
    },
    methods:{
        commentHeadImgUrl(val) {
            if(val === undefined) {
                return 'http://srs.sf-express.com/filemange/' + this.applyUpNum + '.jpg';
            } else {
                return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
            }
        },
        loadMore() {
            let that = this;
            var matchHotDOM = this.$refs.matchHot;
            matchHotDOM.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = matchHotDOM.offsetHeight
                var scrollTop = matchHotDOM.scrollTop;
                var scrollHeight = matchHotDOM.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.canScroll = false;
                    that.isShowLoading = true;
                    that.$axios.get('match/queryHotMatchInfo',{
                        params: {
                            currentPage: that.currentPage,
                            pageSize: that.pageSize
                        }
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result;
                            if(list.length !== 0) {
                                that.hotList = that.hotList.concat(list);
                                that.currentPage = that.currentPage + 1;                                
                                that.canScroll = true;
                            } else {
                                that.canScroll = false;
                            }
                            that.isShowLoading = false;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            })
        },
        getMineInfo() {
            let that = this;
            this.$axios.post('/match/obtainuserApplyInfo')
            .then(function (res) {
                var data = res.data;
                localStorage.setItem('applyUpNum', data.result.applyUpNum)
                localStorage.setItem('headImageType', data.result.headImageType);
                localStorage.setItem('regional', data.result.regional);
                localStorage.setItem('totalDivision', data.result.totalDivision);
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        linkTo:function (){
            window.location.href = '/matchRule';
        },
        getHotData:function(){
            let that = this;
            this.$axios.get('match/queryHotMatchInfo',{
                params: {
                    currentPage: this.currentPage,
                    pageSize: this.pageSize
                }
            })
            .then(function (response) {
                var data = response.data;
                that.isShowLoading = false;
                if(data.succ === 'ok') {
                    var list = data.result;
                    if(list.length !== 0) {
                        that.hotList = list;
                        that.currentPage = that.currentPage + 1;
                        that.loadMore();
                    } else {
                        that.hotList = [];
                        that.isShowLoading = false;
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        toDetail(uuid) {
            this.$router.push({
                name:'matchDetail',
                params: {
                    uuid: uuid
                }
            })
        },
        toggleLike(yetLike, uuid, index) {
            console.log(index)
            if(yetLike === 'yes') {
                this.handleCancelLike(uuid, index);
            } else {
                this.handleLike(uuid, index);
            }
        },
        handleLike(uuid, index) {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('match/likeVideo',{
                "uuid":uuid
            })
            .then(function (res) {
                if(index === 'hotOne') {
                    ++that.hotOne.likeNum;
                    that.hotOne.yetLike = 'yes'
                } else {
                    ++that.hotList[index].likeNum;
                    that.hotList[index].yetLike = 'yes';
                }
                that.isShowLoading = false;
            })
            .catch(function (error) {
                that.isShowLoading = false;
            });
        },
        handleCancelLike(uuid, index) {
             this.isShowLoading = true;
            let that = this;
            this.$axios.post('match/cancelLikeVideo',{
                "uuid":uuid
            })
            .then(function (res) {
                if(index === 'hotOne') {
                    --that.hotOne.likeNum;
                    that.hotOne.yetLike = 'no'
                } else {
                    --that.hotList[index].likeNum;
                    that.hotList[index].yetLike = 'no';
                }
                that.isShowLoading = false;
            })
            .catch(function (error) {
                that.isShowLoading = false;
            });
        },
        headDecorate(headImageType) {
            if(headImageType === 1) {
                return require("../../assets/images/avatar1.png")
            } else if(headImageType === 2) {
                return require("../../assets/images/avatar2.png")
            } else if(headImageType === 3) {
                return require("../../assets/images/avatar3.png")
            }
        },
        getImgUrl(url) {
            return _imgConfigUrl + '/sfimimgload?path=' + url;
        },
        getOfficialVideo() {
            let that = this;
            this.$axios.post('match/queryOfficialMatchInfo')
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    // if(data.result === null) {
                    //     that.hotOne = {};
                    //     return;
                    // }
                    that.hotOne = data.result;
                }
            })
        }
    },
    filters: {
        filterLikeNum(likeNum, yetLike) {
            // if(yetLike === 'yes') {
            //     return likeNum + 1;
            // } else {
            //     return likeNum;
            // }
            return likeNum;
        },
        likeIcon(yetLike) {
            if(yetLike === 'yes') {
                return require('../../assets/images/heart2.png')
            } else {
                return require('../../assets/images/love.png')
            }
        }
    }
}
</script>

<style lang="less" scoped>
.official-symbol{
    position: absolute;
    right: 10px;
    top: 20px;
    padding: 0px 5px;
    border-radius: 2px;
    font-size: 14px;
    color: #fff;
    background: rgb(238, 66, 66);
    z-index: 1;
}
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 12px;
    margin-top: 20px;
    padding-bottom: 20px;
}
.flex-item-tab{
    height: 50px;
    background: white;
    text-align: center;
    margin: 4px;
    border-radius: 5%;
    padding: 10px 0px;
    img{
        width: 28px;
        height: auto;
        display: inline-block;
        vertical-align: middle;
       
    };
    span{
        margin-left: 15px;
        font-size: 15px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        color: #212121;
        font-weight: 600;

    }
}
.block-head{
    background: white;
    .block-head-main{
        padding-top: 10px;
        position: relative;
        .block-img{
            position: relative;
            width: 100%;
            height: 100%;
            height: 150px;
            overflow: hidden;
            img{
                width: 100%;
                /* height: 100%; */
                position: absolute;
                top: 50%;
                transform: translate(0, -50%);
            }
        }
        .block-text{
            color: white;
            position: absolute;
            margin: 10px;
            bottom: 0px;
            .text-title{
                display: inline-block;
                font-size: 16px;
                word-break: break-word;
            }
            .regional{
                background: #4394f4;
                color: white;
                padding: 1px 6px;
                border-radius: 2px;
            }
        }
        .btn-play{
            position: absolute;
            left: 50%;
            top: 50%;
            margin-left: -25px;
            margin-top: -25px;
            img{
                width: 50px;
                height: 50px;
            }
        }
    }
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
.item-container{
    margin: 6px 0px;
    background: white;
    .item-title{
        padding: 15px;
        font-size: 16px;
        border-bottom: 1px solid #e6e6e6;
    }
}
.item{
    border-bottom: 1px solid #e6e6e6;
    padding: 10px;
}
.item:last-child{
    border-bottom: 0;
}
.item-img{
    height: 105px;
    position: relative;
    overflow: hidden;
    img{
        width: 200%;
        /* height: 100%; */
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
.item-content{
    height: 105px;
    position: relative;
    .item-content-usermsg{
        display: flex;
        align-items: center;
        position: relative;
        margin-left: 10px;
        .head-decorate{
            position: absolute;
            top: -8px;
            left: -5px;
            img{
                width: 40px;
                height: auto;
            }
        }
        img{
            flex: 30px 0 0;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            
        }
        .username-match-hot{
            flex: 50px 0 0;
            color: #878787;
            margin-left: 4px;
            margin-right: 10px;
        }
        .competition-area{
            background: #4394f4;
            color: white;
            padding: 2px 5px;
            border-radius: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
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
        margin-bottom: 5px;
        margin-left: 10px;
        margin-top: 5px;
        word-break: break-word;
    }
    .icon-wrap{
        position: absolute;
        bottom: -10px;
    }
}
</style>

