<template>
    <div>
         <v-navbar class="navbar-demo2" setBgColor="#fff">海选任务</v-navbar>
         <!-- 进度 -->
         <div class="progress" :class="showProgress[0] ? '':'hided'">
             <div>
                 <img src="../assets/images/one.png">
                 <span class="actived">点亮头像</span>
                 <img src="../assets/images/jiantou.png">
             </div>
             <div>
                 <img src="../assets/images/two-gray.png">
                 <span>签署公约</span>
                 <img src="../assets/images/jiantou.png">
             </div>
             <div>
                 <img src="../assets/images/three-gray.png">
                 <span>完成任务</span>
                 
             </div>
         </div>
         <div class="progress" :class="showProgress[1] ? '':'hided'">
             <div>
                 <img src="../assets/images/one.png">
                 <span class="actived">点亮头像</span>
                 <img src="../assets/images/jiantou1.png">
             </div>
             <div>
                 <img src="../assets/images/two.png">
                 <span class="actived">签署公约</span>
                 <img src="../assets/images/jiantou.png">
             </div>
             <div>
                 <img src="../assets/images/three-gray.png">
                 <span>完成任务</span>
                 
             </div>
         </div>
         <div class="progress" :class="showProgress[2] ? '':'hided'" >
             <div>
                 <img src="../assets/images/one.png">
                 <span class="actived">点亮头像</span>
                 <img src="../assets/images/jiantou1.png">
             </div>
             <div>
                 <img src="../assets/images/two.png">
                 <span class="actived">签署公约</span>
                 <img src="../assets/images/jiantou1.png">
             </div>
             <div>
                 <img src="../assets/images/three.png">
                 <span class="actived">完成任务</span>
                 
             </div>
         </div>
         <!-- 点亮脸谱头像 -->
         <div class="container" :class="showStatus[0] ? '':'hided'">
            <div class="avatar">
                <img :src="commentHeadImgUrl">
            </div>     
            <div class="dotask" @click="lightAvatar()">
                点亮脸谱头像
            </div>
          

         </div>
         <!-- 点击添加头像装饰 -->
         <div class="container" :class="showStatus[1] ? '':'hided'">
            <div class="avatar">
                <img :src="commentHeadImgUrl">
                <div class="avatar-img" v-if="decreationImgUrl">
                    <img  :src="decreationImgUrl">
                </div>
            </div>
            <div class="avatar-decreation">
                 <div class="avatar-decreation-img" v-for="(item,key) in imglist" :key="key">
                    <img :src="commentHeadImgUrl">
                    <div class="decreation-img">
                        <img  @click="getImgSrc(item.imgurl, item.headImageType)"  :src=item.imgurl>
                    </div>
                 </div>
                 
                
            </div>
             
            <div class="decreation-text">点击添加头像装饰</div>
            
            <div class="dotask" style="background:#ea1818" @click="confirmAvatar()">
                确定头像
            </div>
            

         </div>
         <!-- 下一步 -->
         <div class="container" :class="showStatus[2] ? '':'hided'">
            <div class="avatar">
                <img :src="commentHeadImgUrl">
                <div class="avatar-img" v-if="decreationImgUrl">
                    <img  :src="decreationImgUrl">
                </div>
            </div>
             
            <div class="dotask" @click="nextStep()">
                    下一步
            </div>
            

         </div>
         <!-- 签署公约 -->
        <div class="container" :class="showStatus[3] ? '':'hided'">
            <div class="pledge">
                <h3>脸谱宣言</h3>
                <div class="pledge-content">
                    公司logo（脸谱）是公司文化的象征，它代表着低调务实、正直诚信、积极阳光。作为顺丰一员，我们每一个人都代表着顺丰，为此，我将践行logo赋予的使命，捍卫顺丰的企业愿景、核心价值观，以842、421为工作指引，坚守诚信基本准则。顺丰有我，我就是顺丰。
                </div>
            </div>
            
            <div class="dotask btnSign" @click="signPledge()">
                    签署公约
            </div>

        </div>
        <!-- 发表脸谱宣言 -->
        <div class="container" :class="showStatus[4] ? '':'hided'">
            <div class="tips">你已经完成海选任务，快去发表你的脸谱宣言，参与海选吧</div>
            <router-link class="tab-item-text" to="/publishManifesto">
                <div class="dotask">
                    发表脸谱宣言
                </div>
            </router-link>

        </div>
    </div>
</template>

<script>
import Vue from 'vue';
export default {
    data() {
        return {
            showProgress:[true,false,false],
            showStatus:[true,false,false,false,false],
            decreationImgUrl:"",
            headImageType:'',
            imglist:[
                {
                    imgurl:require("../assets/images/avatar1.png"),
                    headImageType: 1
                },
                {
                    imgurl:require("../assets/images/avatar2.png"),
                    headImageType: 2
                },
                {
                    imgurl:require("../assets/images/avatar3.png"),
                    headImageType: 3
                }
            ],
            applyUpNum: localStorage.getItem('applyUpNum')
        }
      
    },
    mounted(){

    },
    methods:{
        lightAvatar:function(){
            let that = this;
            that.showStatus = [false,true,false,false,false]
            
        },
        confirmAvatar:function(){
            let that = this;
            if(this.headImageType === '') {
                this.$toast.show({
                    text: '请选择头像装饰',
                    type: 'text'    
                });
                return;
            }
            that.showProgress = [true,false,false]
            that.showStatus = [false,false,true,false,false]
            
        },
        nextStep:function(){
            let that = this;
            that.showProgress = [false,true,false]
            that.showStatus = [false,false,false,true,false]

        },
        signPledge:function(){
            let that = this;
            this.$axios.post('match/finishAudition', {
                'headImageType': that.headImageType
            })
            .then(function (response) {
                console.log(response)
               that.showProgress = [false,false,true];
               that.showStatus = [false,false,false,false,true];
            })
            .catch(function (error) {
                console.log(error);
            }); 

        },
        getImgSrc:function(url,type){
            console.log(url, type)
            this.decreationImgUrl = url;
            this.headImageType = type;
            
            

        }

    },
    computed: {
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + this.applyUpNum + '.jpg';
        }
    },
}
</script>

<style lang='less' scoped>
.hided{
    display: none !important;
}
.progress{
    display: -webkit-flex;
    display: flex;
    margin: 10px 15px;
    div{
        width: 33.3%;
        img:first-child{
            width: 20px;
            height: 20px;
        }
        img{
            vertical-align: middle;
            width: 20px;
        }
        span{
            display: inline-block;
            
            text-align: center;
            position: relative;
            
            top: 2px;
        }
        .actived{
            color: #f7c300;
        }
    }
}
.container{
    margin: 10px 15px;
    background: white;
    padding: 10px 0px;
    border-radius: 5px;
    .avatar{
        width: 80px;
        height: 80px;
        margin: 25px auto;
        border-radius: 50%;
        position: relative;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
        }
        .avatar-img{
            width: 110px;
            height: 110px;
           -webkit-transform: translate(-50%, -50%);
            transform: translate(-50%, -50%);
            position: absolute;
            top: 43%;
            left: 50%;
            img{
                width: 100%;
                height: 100%;
                border-radius: 50%;
            }
        }
    }
    .decreation-text{
        text-align: center;
        color: #ea1818;
        margin-top: 20px;
        font-size: 16px;
    }
    .avatar-decreation{
        border-top: 1px solid #f4f4f4;
        display: flex;
        display: -webkit-flex;
        width: 100%;
        padding-top: 30px;
        margin-bottom: 15px;
        .avatar-decreation-img{
            width: 33.33%;
            height: 80px;
            text-align: center;
            position: relative;
            img{
                height: 80px;
                height: 80px;
                border-radius: 50%;
                vertical-align: middle;
            }
            .decreation-img{
                -webkit-transform: translate(-50%, -50%);
                transform: translate(-50%, -50%);
                position: absolute;
                top: 43%;
                left: 50%;
                img{
                   height: 110px;
                   width: 110px;
                   border-radius: 50%;
                }

            }
          

        }
    }
    .submit-btn,.dotask{
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
    .btnSign{
        position: absolute;
        top: 55%;
        left: 50%;
        margin-left: -25%;
    }    
    .pledge{
        h3{
            font-size: 20px;
            text-align: center;
            // color: #4e4e4e;
        }
        .pledge-content{
            text-indent: 2em;
            padding: 10px;
            font-size: 14px;
            line-height: 24px;
        }
    }
    .tips{
        text-align: center;
        padding: 20px;
        font-size: 16px;
    }

}
</style>

