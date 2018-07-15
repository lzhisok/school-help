<template>
    <div class="community-hot" ref="communityHot">
       <div class="scroller-box">
            <!-- <v-scroller-x ref="scrollerx"  class="scroller-x"> -->
                <ul class="scroller-x" ref="scrollerx">
                    <li v-for="(item, key) in topHotList" :key="key" @click="toDetail(item.uuid)">
                        <img src="../../assets/images/hot.png">
                        <div>
                            <h3>
                                {{item.manifestoTitle}}
                            </h3>
                            <p>{{item.commentNum}}条互动</p>
                        </div>
                    </li>
                </ul>
            <!-- </v-scroller-x> -->
        </div>
        
        <div class="community-block-head" v-for="(item, index) in superManagerList" :key="index" @click="toDetail(item.uuid)">
                <div class="block-head-main">
                    <span class="official-symbol">官方</span>
                    <div class="block-img">
                        <img :src="item.coverUrl" v-if="item.coverUrl !== ''">
                        <img :src="getImgUrl(item.videoUrl)" v-else-if="item.videoUrl !== ''">
                    </div>
                    <div class="block-text">
                        <p>{{item.manifestoTitle}}</p>
                    </div>
                </div>
                <v-flexbox :gutter="0">
                    <v-flexbox-item :span='4'>
                        <div class="community-flex-msg">
                                <div class="msg-icon" @click.stop="toggleLike(item.publishEntrance, item.yetLike, item.uuid, index)">
                                    <img slot="icon" :src="item.yetLike | likeIcon">
                                    <!-- <img slot="icon" src="../../assets/images/view.png"> -->
                                </div>
                                <span>{{item.likeNum}}</span>
                            </div>
                    </v-flexbox-item>
                    <v-flexbox-item :span='4'>
                        <div class="community-flex-msg">
                                <div class="msg-icon">
                                    <img slot="icon" src="../../assets/images/comment.png">
                                </div>
                                <span>{{item.commentNum}}条互动</span>
                            </div>
                    </v-flexbox-item>
                    
                </v-flexbox>
        </div>
        <!-- 社区列表 -->
        <div class="community-container" v-for="(item, index) in hotList" :key="item.uuid">          
           <div class="community-item" @click="toDetail(item.uuid)" v-if="item.publishEntrance === 1">
                    <div class="community-user-msg">
                        <img class="group-img" src="../../assets/images/group.png">
                        <span>{{item.orgName}}组委会</span>
                        <img class="vip-flag" src="../../assets/images/vip.png">
                    </div>
                    <div class="group">
                        <div class="group-content">
                            <div class="community-title">{{item.manifestoTitle}}</div>
                                    <v-flexbox :gutter="0">
                                        <v-flexbox-item :span='6'>
                                            <div class="community-flex-msg">
                                                    <div class="msg-icon" @click.stop="toggleLike(item.publishEntrance, item.yetLike, item.uuid, index)">
                                                        <img slot="icon" :src="item.yetLike | likeIcon">
                                                    </div>
                                                    <span>{{item.likeNum}}</span>
                                                </div>
                                        </v-flexbox-item>
                                        <v-flexbox-item :span='6'>
                                            <div class="community-flex-msg">
                                                    <div class="msg-icon">
                                                        <img slot="icon" src="../../assets/images/comment.png">
                                                    </div>
                                                    <span>{{item.commentNum}}条互动</span>
                                                </div>
                                        </v-flexbox-item>
                                        
                                    </v-flexbox>
                        </div>
                        <div class="group-img">
                            <img :src="item.coverUrl" v-if="item.coverUrl !== ''">
                            <img :src="getImgUrl(item.videoUrl)" v-else>
                        </div>
                    </div>
           </div>
            <div class="community-item" v-else-if="item.publishEntrance === 0">
                <div @click="toDetail(item.uuid)">
                    <div class="community-user-msg">
                        <img :src='commentHeadImgUrl(item.publishManNum)'>
                        <div class="head-decorate" v-if="item.headImageType !== 0">
                            <img :src="headDecorate(item.headImageType)" />
                        </div>
                        <span>{{item.publishManName}}</span>
                    </div>
                    <div class="community-title">{{item.manifestoTitle}}</div>
                    <v-flexbox :gutter="0">
                            <v-flexbox-item :span='4'>
                                <div class="community-flex-msg">
                                        <div class="msg-icon" @click.stop="toggleLike(item.publishEntrance, item.yetLike, item.uuid, index)">
                                            <img slot="icon" :src="item.yetLike | likeIcon">
                                        </div>
                                        <span>{{item.likeNum}}</span>
                                    </div>
                            </v-flexbox-item>
                            <v-flexbox-item :span='4'>
                                <div class="community-flex-msg">
                                        <div class="msg-icon">
                                            <img slot="icon" src="../../assets/images/comment.png">
                                        </div>
                                        <span>{{item.commentNum}}条互动</span>
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
import Vue from 'vue'
import ScrollerX from 'sfmui';
Vue.use(ScrollerX);
export default {
    data() {
        return {
            topHotList: [],
            superManagerList: [],
            areaManagerList: [],
            hotList: [],
            currentPage: 1,
            pageSize: 15,
            canScroll: true,
            isShowLoading: true
        }
    },
    mounted(){
        this.getTopStickData();
        this.getSuperManagerData();
        this.getHotData();
    },
    methods:{
        commentHeadImgUrl(val) {
             return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        linkTo:function (){
            window.location.href = '/matchRule';
        },
        getTopStickData() {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/queryTopPostInfo')
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var list = data.result;
                    if(list.length !== 0) {
                        that.topHotList = list;
                        that.$refs.scrollerx.style.width = 230 * list.length + 'px'
                        // that.$refs.scrollerx.style.width = 250 * that.topHotList.length + 'px';
                    }
                }
            })
        },
        getSuperManagerData() {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/querySuperPostInfo')
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var list = data.result;
                    if(list.length !== 0) {
                        that.superManagerList = list;
                    } else {
                        that.superManagerList = [];
                    }
                }
            })
            .catch((err) => {
                console.log(err)
            })
        },
        getHotData:function(){
            let that = this;
            this.$axios.post('post/queryHotPostInfo',{
                "currentPage": this.currentPage,
                "pageSize": this.pageSize
            })
            .then(function (response) {
                var data = response.data;
                if(data.succ === 'ok') {
                    that.isShowLoading = false;
                    var list = data.result;
                    if(list.length !== 0) {
                        that.hotList = list;
                        that.currentPage++;
                        that.loadMore();
                    } else {
                        that.hotList = [];
                    }
                }
            })
            .catch(function (error) {
                that.isShowLoading = false;
                console.log(error);
            });
        },
        loadMore() {
            let that = this;
            var communityHotDOM = this.$refs.communityHot;
            communityHotDOM.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = communityHotDOM.offsetHeight
                var scrollTop = communityHotDOM.scrollTop;
                var scrollHeight = communityHotDOM.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.canScroll = false;
                    that.isShowLoading = true;
                    that.$axios.post('post/queryHotPostInfo',{
                        "currentPage": that.currentPage,
                        "pageSize": that.pageSize
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result;
                            if(list.length !== 0) {
                                that.hotList = that.hotList.concat(list);
                                that.currentPage++;
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
        toDetail(uuid) {
            this.$router.push({
                name:'communityDetail',
                params: {
                    uuid: uuid
                }
            })
        },
        toggleLike(publishEntrance, yetLike, uuid, index) {
            if(yetLike === 'yes') {
                this.handleCancelLike(publishEntrance, uuid, index);
            } else {
                this.handleLike(publishEntrance, uuid, index);
            }
        },
        handleLike(publishEntrance, uuid, index) {
             this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/likePost',{
                "uuid":uuid
            })
            .then(function (res) {
                if(publishEntrance === 2) {
                    ++that.superManagerList[index].likeNum;
                    that.superManagerList[index].yetLike = 'yes';
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
        handleCancelLike(publishEntrance, uuid, index) {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/cancelLikePost',{
                "uuid":uuid
            })
            .then(function (res) {
                if(publishEntrance === 2) {
                    --that.superManagerList[index].likeNum;
                    that.superManagerList[index].yetLike = 'no';
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
        }
    },
    filters: {
        likeIcon(yetLike) {
            if(yetLike === 'yes') {
                return require('../../assets/images/dianzan2.png')
            } else {
                return require('../../assets/images/dianzan1.png')
            }
        },
    }
}
</script>

<style lang="less" scoped>
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 12px;
    margin-top: 20px;
    padding-bottom: 20px;
}
.scroller-box {
    box-sizing: border-box;
    overflow-x: auto;
    width: 100%;
    // height: 75px;
    background: #F5F5F9;
    &::-webkit-scrollbar {display:none}
}
.scroller-x {
    ul{
        clear: both;
    }
}
ul li{
  list-style: none;
}
.scroller-x li {
  float: left;
    margin: 4px;
    width: 200px;
    height: 55px;
    background: white;
    padding: 10px;
    display: flex;
    align-items: center;
    img{
        vertical-align: middle;
        width: 32px;
        height: 35px;
    }
    div{
        h3{
            width: 140px;
            font-size: 16px;
            color: #212121;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        p{
            font-size: 14px;
            color: #999;
        }
    }
}
.flex-demo{
    background: white;
    text-align: center;
    margin: 10px 10px;
    border-radius: 5%;
    padding: 10px 20px;
    img{
        width: 35px;
        height: 35px;
        display: inline-block;
        vertical-align: middle;
       
    };
    span{
        margin-left: 15px;
        font-size: 18px;
        display: inline-block;
        vertical-align: middle;
        text-align: center;
        color: #212121;
        font-weight: 600;

    }
}
.group{
    display: flex;
    display: -webkit-flex;
    .group-content{
        width: 70%;
    }
    .group-img{
        width: 90px;
        height: 66px;
        position: relative;
        overflow: hidden;
        img{
            width: 100%;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
        }
    }
}
.community-block-head{
    background: white;
    border-bottom: 1px solid #e6e6e6;
    .block-head-main{
        padding-top: 10px;
        position: relative;
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
        .block-img{
            position: relative;
            width: 100%;
            height: 100%;
            height: 150px;
            overflow: hidden;
            img{
                width: 100%;
                position: absolute;
                top: 50%;
                transform: translate(0, -50%);
            }
        }
        .block-text{
            color: white;
            position: absolute;
            padding: 10px;
            bottom: 0px;
            width: 100%;
            p{
                display: inline-block;
                font-size: 14px;
                word-break: break-word;
            }
            span{
                
               position: absolute;
                color: white;
                right: 20px;
                font-size: 14px;
                padding: 0 5px;
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
.community-flex-msg{
    padding: 10px 0px;
    margin-left: 10px;
    .msg-icon{
        display: inline-block;
        width: 18px;
        height: 100%;
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

.community-container{
    background: white;
    .community-item{
        border-bottom: 1px solid #e6e6e6;
    }
    .community-user-msg{
        padding: 10px;
        position: relative;
        .head-decorate{
            position: absolute;
            top: 5px;
            left: 6px;
            img{
                width: 48px;
                height: auto;
            }
        }
        .group-img{
            width: 28px;
            height: auto;
            border-radius: 50%;
            vertical-align: bottom;
        }
        .vip-flag{
            width: 18px;
            height: auto;
            vertical-align: bottom;
            margin-left: 4px;
        }
        img{
            height: 40px;
            height: 40px;
            border-radius: 50%;
            vertical-align: middle;

        }
        span{
            margin-left: 10px;
            font-size: 14px;
            position: relative;
            color: #878787;
            top: 2px;
        }
        .publishTime{
            position: absolute;
            right: 15px;
            top: 15px;
            font-size: 12px;

        }
        
        
    }
    .community-title{
            margin: 10px 5px 5px 10px;
            font-size: 18px;
            color: #212121;
            font-weight: bold;
            word-break: break-word;
        }

}
</style>

