<template>
    <div class="new-item" ref="matchNew">
       <div class="item" v-for="(item, key) in newList" :key="key">
            <div @click="toDetail(item.uuid)">
                <v-flexbox>
                    <v-flexbox-item :span="4">
                        <div class="item-img">
                            <img :src="item.coverUrl">
                        </div>
                    </v-flexbox-item>
                    <v-flexbox-item>
                        <div class="item-content">
                            <div class="item-content-usermsg">
                                <img :src='commentHeadImgUrl(item.applyUpNum)'>
                                <div class="head-decorate" v-if="item.headImageType !== 0">
                                    <img :src="headDecorate(item.headImageType)" />
                                </div>
                                <span class="username">{{item.applyUpName}}</span>
                                <span class="regional">{{item.regional}}</span>
                                <span class="publishTime">{{item.publishTimeStr}}</span>
                            </div>
                            <p>{{item.manifestoTitle}}</p>
                            <v-flexbox :gutter="0" class="icon-wrap">
                                <v-flexbox-item class="visit-item">
                                    <div class="flex-new-msg">
                                        <div class="msg-icon">
                                            <img slot="icon" class="icon1" src="../../assets/images/view.png">
                                        </div>
                                        <span>{{item.visitNum}}</span>
                                    </div>
                                </v-flexbox-item>
                                <v-flexbox-item>
                                    <div class="flex-new-msg">
                                        <div class="msg-icon">
                                            <img slot="icon" class="icon2" src="../../assets/images/comment.png">
                                        </div>
                                        <span>{{item.commentNum}}</span>
                                    </div>
                                </v-flexbox-item>
                                <v-flexbox-item>
                                    <div class="flex-new-msg">
                                        <div class="msg-icon" @click.stop="toggleLike(item.yetLike, item.uuid, key)">
                                            <img slot="icon" class="icon3" :src="item.yetLike | likeIcon">
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
        <div class="no-data">没有更多数据了哦~</div>
        <loading v-show="isShowLoading"></loading>      
    </div>
</template>

<script>
export default {
    data() {
        return {
            newList:'',
            currentPage: 1,
            isShowLoading: true,
            canScroll: true
        }
    },
    mounted(){
       this.getNewData();
    },
    methods:{
        getNewData:function(){
            let that = this;
            this.$axios.post('match/queryNewestMatchInfo',{
                "currentPage": this.currentPage,
                "pageSize":15
            })
            .then(function (response) {
                var data = response.data;
                that.isShowLoading = false;
                if(data.succ === 'ok') {
                    var list = data.result;
                    if(list.length !== 0) {
                        that.newList = list;
                        that.loadMore();
                    }
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        loadMore() {
            let that = this;
            var matchNewDOM = this.$refs.matchNew;
            matchNewDOM.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = matchNewDOM.offsetHeight
                var scrollTop = matchNewDOM.scrollTop;
                var scrollHeight = matchNewDOM.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.isShowLoading = true;
                    that.canScroll = false;
                    this.$axios.post('match/queryNewestMatchInfo',{
                        currentPage: that.currentPage,
                        pageSize:15
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result;
                            if(list.length !== 0) {
                                that.newList = that.newList.concat(list);
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
        toDetail(uuid) {
            this.$router.push({
                name:'matchDetail',
                params: {
                    uuid: uuid
                }
            })
        },
        toggleLike(yetLike, uuid, index) {
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
                ++that.newList[index].likeNum;
                that.newList[index].yetLike = 'yes';
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
                --that.newList[index].likeNum;
                that.newList[index].yetLike = 'no';
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
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        getImgUrl(url) {
            return _imgConfigUrl + '/sfimimgload?path=' + url;
        }
    },
    filters: {
        filterLikeNum(likeNum, yetLike) {
            if(yetLike === 'yes') {
                return likeNum + 1;
            } else {
                return likeNum;
            }
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
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 12px;
    margin-top: 20px;
}
.flex-new-msg{
    padding: 5px 0px;
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
.new-item{
    margin-top: 6px;
    overflow-y: auto;
}
.item-container{
    margin: 12px 0px;
    background: white;
    .item-title{
        padding: 15px;
        border-bottom: 1px solid #e6e6e6;
    }
}
.item{
    background: white;
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
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }

}
.item-content{
    padding-top: 5px;
    box-sizing: border-box;
    height: 105px;
    position: relative;
    .item-content-usermsg{
        position: relative;
        margin-left: 10px;
        display: flex;
        align-items: center;
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
        .username{
            flex: 50px 0 0;
            width: 50px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 12px;
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
        .publishTime{
            position: absolute;
            top: -14px;
            right: 0;
            color: #999;
        }
        .regional{
            padding: 1px 3px;
            border-radius: 2px;
            background: #4394f4;
            color: white;
            font-size: 12px;
            vertical-align: middle;
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
.visit-item .msg-icon{
    margin-right: 5px;
}
</style>