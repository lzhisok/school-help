<template>
    <div class="new-item" ref="communityNew">
        <div v-for="(item, index) in hotList" :key="index">
            <div v-if="item.publishEntrance === 2" class="community-block-head" @click="toDetail(item.uuid)">
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
                                <div class="msg-icon">
                                    <img slot="icon" src="../../assets/images/view.png">
                                </div>
                                <span>{{item.likeNum}}</span>
                            </div>
                    </v-flexbox-item>
                    <v-flexbox-item :span='4'>
                        <div class="community-flex-msg">
                                <div class="msg-icon">
                                    <img slot="icon" src="../../assets/images/comment.png">
                                </div>
                                <span>{{item.commentNum}}</span>
                            </div>
                    </v-flexbox-item>
                    
                </v-flexbox>
            </div>
            <!-- 社区列表 -->
            <div class="community-container" v-else-if="item.publishEntrance === 1">          
                <div class="community-item"  @click="toDetail(item.uuid)">
                    <div class="community-user-msg">
                        <img class="group-img" src="../../assets/images/group.png">
                        <span>{{item.orgName}}组委会</span>
                        <img class="vip-flag" src="../../assets/images/vip.png">
                        <span class="publish-time">{{item.publishTimeStr}}</span>
                    </div>
                    <div class="group">
                        <div class="group-content">
                            <div class="community-title">{{item.manifestoTitle}}</div>
                                    <v-flexbox :gutter="0">
                                        <v-flexbox-item :span='4'>
                                            <div class="community-flex-msg">
                                                    <div class="msg-icon" @click.stop="toggleLike(item.yetLike, item.uuid, index, item.publishEntrance)">
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
                        <div class="group-img">
                            <img :src="item.coverUrl" v-if="item.coverUrl !== ''">
                            <img :src="getImgUrl(item.videoUrl)" v-else>
                        </div>
                    </div>
                </div>
            </div>
            <div class="community-container" v-else>
                <div class="community-item">
                    <div @click="toDetail(item.uuid)">
                        <div class="community-user-msg">
                            <img :src='commentHeadImgUrl(item.publishManNum)'>
                            <div class="head-decorate" v-if="item.headImageType !== 0">
                                <img :src="headDecorate(item.headImageType)" />
                            </div>
                            <span>{{item.publishManName}}</span>
                            <span class="publish-time">{{item.publishTimeStr}}</span>
                        </div>
                        <div class="community-title">{{item.manifestoTitle}}</div>
                        <v-flexbox :gutter="0">
                                <v-flexbox-item :span='4'>
                                    <div class="community-flex-msg">
                                            <div class="msg-icon" @click.stop="toggleLike(item.yetLike, item.uuid, index, item.publishEntrance)">
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
       </div>
       <div class="no-data">没有更多数据了哦~</div>
       <loading v-show="isShowLoading"></loading>
    </div>
</template>

<script>
export default {
    data() {
        return {
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
       this.getNewData();
    },
    methods:{
        commentHeadImgUrl(val) {
             return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        getNewData:function(){
            let that = this;
            this.$axios.post('post/queryNewestPostInfo',{
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
            var communityNewDOM = this.$refs.communityNew;
            communityNewDOM.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = communityNewDOM.offsetHeight
                var scrollTop = communityNewDOM.scrollTop;
                var scrollHeight = communityNewDOM.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.isShowLoading = true;
                    that.canScroll = false;
                    that.$axios.post('post/queryNewestPostInfo',{
                        "currentPage": that.currentPage,
                        "pageSize": that.pageSize
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result;
                            if(list.length !== 0) {
                                console.log(list)
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
        toggleLike(yetLike, uuid, index, type) {
            if(yetLike === 'yes') {
                this.handleCancelLike(uuid, index, type);
            } else {
                this.handleLike(uuid, index, type);
            }
        },
        handleLike(uuid, index, type) {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/likePost',{
                "uuid":uuid
            })
            .then(function (res) {
                ++that.hotList[index].likeNum;
                that.hotList[index].yetLike = 'yes';
                that.isShowLoading = false;
            })
            .catch(function (error) {
                that.isShowLoading = false;
            });
        },
        handleCancelLike(uuid, index, type) {
            this.isShowLoading = true;
            let that = this;
            this.$axios.post('post/cancelLikePost',{
                "uuid":uuid
            })
            .then(function (res) {
                --that.hotList[index].likeNum;
                that.hotList[index].yetLike = 'no';
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
        }
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
.flex-new-msg{
    padding: 10px 0px;
    text-align: center;
    .msg-icon{
        display: inline-block;
        width: 23px;
        height: 16px;
    }
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
    img{
        width: 100%;
        height: 100%;
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
.new-item{
    margin-top: 10px;
    position: relative;
    bottom: 10px;
}
.item-container{
    margin: 12px 0px;
    background: white;
    .item-title{
        padding: 15px;
    }
}
.item{
    background: white;
    border-top: 1px solid #e6e6e6;
    padding: 10px;
}
.item-img{
    height: 105px;
    img{
        width: 100%;
        height: 100%;
    }

}
.item-content{
    height: 105px;
    position: relative;
    .item-content-usermsg{
        margin-left: 10px;
        position: relative;
        img{
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: inline-block;
            vertical-align: middle;
            
        }
        .username{
            color: #878787;
            // margin-right: 10px;
        }
        .competition-area{
            background: #4394f4;
            color: white;
            padding: 0 5px;
        }
        .publishTime{
            position: absolute;
            right: 15px;
            top: 10px;
            font-size: 12px;
        }
        
    }
    p{
        height: 40px;
        color: #333;
        font-size: 1.25em;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: 20px;
        margin-left: 10px;
        margin-top: 5px;
    }
}

.group{
    display: flex;
    display: -webkit-flex;
    .group-content{
        width: 80%;
    }
    .group-img{
        width: 66px;
        height: 66px;
        position: relative;
        overflow: hidden;
        img{
            width: 200%;
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
        padding-top: 6px;
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
    .community-item{
        border-bottom: 1px solid #e6e6e6;
    }
    background: white;
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
        .publish-time{
            position: absolute;
            right: 15px;
            top: 10px;
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