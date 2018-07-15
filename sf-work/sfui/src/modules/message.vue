<template>
    <div class="message-list" ref="messageList">
         <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">我的消息</v-navbar> -->
         <v-tab :line-width="2" active-color='#f7c300' bar-active-color="#f7c300" custom-bar-width="50px">
            <v-tab-item selected @on-item-click="onItemClick1()">全部</v-tab-item>
            <v-tab-item @on-item-click="onItemClick2()">评论</v-tab-item>
            <v-tab-item @on-item-click="onItemClick3()">点赞</v-tab-item>
            <v-tab-item disabled></v-tab-item>
        </v-tab>
        <!-- 全部 -->
        <div class="all-list" v-if='showTab[0]'>
            <div v-for="(item, key) in messageList" :key="key" class="comment-container dz-container ">
                <div v-if="item.notifyType === 0">
                        <div class="comment-msg">
                            <div class="comment-img">
                                <img :src='commentHeadImgUrl(item.triggerManNum)'>
                            </div>
                            <div class="item-right">
                                <div class="comment-man">
                                    {{item.triggerManName}}
                                    <span style="color:#999;margin-left: 6px;">评论</span>
                                    <div class="com-time">
                                        {{item.createTimeText}}
                                    </div>
                                </div>
                                <div class="msg-content">{{item.notifyContent}}</div>
                                <div class="msg-share" @click="toDetail(item.uuid, item.category)">
                                    <p>{{item.manifestoTitle}}</p>
                                    <div class="img-wrap" v-show="item.coverUrl !== '' && item.videoUrl !== ''">
                                        <img :src="item.coverUrl" v-if="item.coverUrl !== ''">
                                        <img :src="getImgUrl(item.videoUrl)" v-else v-show="item.videoUrl !== ''">                                
                                    </div>
                                </div>
                            </div>
                        </div>
                </div>
                <!-- 点赞 -->
                <div v-else-if="item.notifyType === 1">
                    <div class="dz-msg">
                        <div class="dz-img">
                            <img :src='commentHeadImgUrl(item.triggerManNum)'>
                        </div>
                        <div class="dz-text">
                            {{item.triggerManName}} 赞了你 {{item.manifestoTitle}}
                        </div>  
                         <div class="dz-time">{{item.createTimeText}}</div>
                    </div>
                </div>           
            </div>
        </div>
        <!-- 评论 -->
        <div v-if='showTab[1]' class="comment-message-list">
            <div v-for="(item, index) in commentList" :key="index" class="comment-container">
                <div class="comment-msg">
                    <div class="comment-img">
                        <img :src='commentHeadImgUrl(item.triggerManNum)'>
                    </div>
                    <div class="item-right">
                        <div class="comment-man">
                            {{item.triggerManName}}
                            <span style="color:#999;margin-left: 6px;">评论</span>
                            <div class="com-time">
                                {{item.createTimeText}}
                            </div>
                        </div>
                        <div class="msg-content">{{item.notifyContent}}</div>
                        <div class="msg-share" @click="toDetail(item.uuid, item.category)">
                            <p>{{item.manifestoTitle}}</p>
                            <div class="img-wrap" v-show="item.coverUrl !== '' && item.videoUrl !== ''">
                                <img :src="item.coverUrl" v-if="item.coverUrl !== ''">
                                <img :src="getImgUrl(item.videoUrl)" v-else v-show="item.videoUrl !== ''">                                
                            </div>
                        </div>
                    </div>
                </div> 
            </div>
        </div>
        <!-- 点赞 -->
        <div class="like-list" v-else-if='showTab[2]'>
            <div v-for="(item, key) in dzList" :key="key" class="dz-container">         
                <div class="dz-msg">
                    <div class="dz-img">
                        <img :src='commentHeadImgUrl(item.triggerManNum)'>
                    </div>
                    <div class="dz-text">
                        {{item.triggerManName}} 赞了你 {{item.manifestoTitle}}
                    </div>
                    
                </div>
                <div class="dz-time">{{item.createTimeText}}</div>           
            </div>
        </div>                 
    </div>
</template>

<script>
import Vue from 'vue';
import { Tab, TabItem,Toast } from 'sfmui'
import VideoPlayer from 'vue-video-player';
Vue.component(Tab.name, Tab);
Vue.component(TabItem.name, TabItem);
export default {
    data() {
        return {
            showTab:[true,false,false],
            messageList: [],
            commentList: [],
            dzList: [],
            likeStr: '',
            currentPage: 1,
            pageSize: 15,
            canScroll: true,
        }
    },
    mounted(){
        this.getMessageData();
        this.$setNavTitle('消息')
    },
    methods:{
        toDetail(uuid, category) {
            if(category === 'match') {
                this.$router.push({
                    name:'matchDetail',
                    params: {
                        uuid: uuid
                    }
                })
            } else if(category === 'post') {
                this.$router.push({
                    name:'communityDetail',
                    params: {
                        uuid: uuid
                    }
                })
            }
        },
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        onItemClick1(){
            this.likeStr = '';
            this.showTab = [true, false, false];
            this.currentPage = 1;
            this.getMessageData();
            this.canScroll = true;
        },
        onItemClick2(){
            this.likeStr = 0;
            this.showTab = [false, true, false];
            this.currentPage = 1;
            this.getMessageData();
            this.canScroll = true;
        },
        onItemClick3(){
            this.likeStr = 1;
            this.showTab = [false, false, true];
            this.currentPage = 1;
            this.getMessageData();
            this.canScroll = true;
        },
        getMessageData:function(){
            let that = this;
            this.$axios.post('mine/queryMineMessageInfo',{
                likeStr: that.likeStr,
                currentPage: this.currentPage,
                pageSize:15
            })
            .then(function (response) {
                if(that.likeStr === '') {
                    that.messageList = response.data.result.list; 
                } else if(that.likeStr === 0) {
                    that.commentList = response.data.result.list; 
                } else if(that.likeStr === 1) {
                    that.dzList = response.data.result.list; 
                }
                console.log(that.messageList)
                that.loadMoreMessage();
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        getImgUrl(coverUrl, videoUrl) {
            if(coverUrl !== '') {
                return _imgConfigUrl + '/sfimimgload?path=' + coverUrl;
            } else if(videoUrl !== '') {
                return _imgConfigUrl + '/sfimimgload?path=' + videoUrl;
            }
        },
        loadMoreMessage() {
            let that = this;
            var messageListDom = this.$refs.messageList;
            messageListDom.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = messageListDom.offsetHeight
                var scrollTop = messageListDom.scrollTop;
                var scrollHeight = messageListDom.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.currentPage += 1;
                    that.canScroll = false;
                    that.$axios.post('mine/queryMineMessageInfo',{
                        likeStr: that.likeStr,
                        currentPage: that.currentPage,
                        pageSize: that.pageSize
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result.list;
                            if(list.length !== 0) {
                                that.messageList = that.messageList.concat(list);
                                that.currentPage += 1;
                                that.canScroll = true;
                            } else {
                                that.canScroll = false;
                            }
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            })
        }
    }
}
</script>

<style lang='less' scoped>
.sfmui-tab {
    margin-top: 6px;
    height: 40px !important;
}
.comment-container{
    background: white;
    padding: 20px 10px;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
        .comment-msg{
        background: white;
        display: flex;
        display: -webkit-flex;
        position: relative;
        .item-right{
            flex: 1;
            margin-left: 15px;
        }
        .comment-img{
            height: 40px;
            width: 40px;
            flex: 40px 0 0;
            img{
                vertical-align: middle;
                width: 100%;
                height: 100%;
                border-radius: 50%;

            }
        }
        .comment-man{
            font-size: 14px;
            color: #666;
             .com-time{
                font-size: 12px;
                right: 20px;
                color: #a0a0a0;
                float: right;
            }
        }
    }
    .msg-content{
        margin-top: 10px;
        color: #666;
        font-size: 16px;
        word-break: break-word;
    }
    .msg-share{
        display: flex;
        background: #f5f5f5;
        margin-top: 15px;
        padding: 10px;
        p{
            flex: 1;
            font-size: 14px;
            color: #333;
        }
        .img-wrap{
            margin-left: 6px;
            position: relative;
            width: 100px;
            height: 100px;
            overflow: hidden;
            img{
                position: absolute;
                width: 150px;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
            }
        }
    }
    
}
.dz-container{
    background: white;
    padding: 20px 10px;
    position: relative;
    border-bottom: 1px solid #e6e6e6;
    .dz-msg{
        background: white;
        display: flex;
        position: relative;
        align-items: center;
        .dz-img{
            height: 40px;
            width: 40px;
            img{
                vertical-align: middle;
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }

        }
        .dz-text{
            flex: 1;
            margin-left: 15px;
            padding: 10px 0;
            font-size: 13px;
            text-overflow:ellipsis;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;
        }
        
    
        
    }
    .dz-time{
        float: right;
        color: #a0a0a0;
        bottom: 13px;
    }
    
}

</style>

