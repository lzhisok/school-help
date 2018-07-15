<template>
    <div>
         <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">我要报名</v-navbar> -->
         <div class="already-apply-tips" v-if="isApply">
             <img src="../assets/images/success.png" class="icon-success" />
             您已成功报名！
             </div>
         <div class="container" :class="changeStatus[0]? '':'hided'">
             <div class="input-box">
                 <label>姓名</label>
                 <input type="text" name='username' v-model="applyUpName" placeholder="输入姓名" disabled>
             </div>   
             <div class="input-box">
                 <label>工号</label>
                 <input type="text" name='userId' v-model="applyUpNum" placeholder="输入工号" disabled>
             </div>    
             <div class="input-box">
                 <label>赛区</label>
                 <input type="text" name='competitionArea' v-model="competitionAreaText" disabled>
             </div>
             <div class="input-box">
                 <label>手机号</label>
                 <input type="text" name='username' class="phone" v-model="applyUpPhone" placeholder="输入手机号">
             </div>  
             <div class="submit-btn" @click="applyCompetition()" v-if="!isApply">
                 提交
             </div> 
             <div class="to-link-tips" v-if="isApply">可前往<img src="../assets/images/user-active.png" />“我的”中查看</div>
             <!-- <div class="already-apply-tips" v-else>您已成功报名！</div>       -->

         </div>
         <div class="container" :class="changeStatus[1]?'':'hided'">
             <div class="success-img">
                 <img src="../assets/images/success.png">
             </div>
             <div class="tips">
                 报名成功，快去完成海选任务吧
             </div>
            <router-link class="tab-item-text" to="/audition">
                <div class="dotask">
                  去做任务
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
            applyUpName:"",
            applyUpNum:"",
            applyUpPhone:"",
            regional:"",
            totalDivision:"",
            competitionArea:"",
            changeStatus:[true,false],
            canApply: true,
            isApply: false
        }
    },
    mounted(){
        this.getApplyInfo();
        this.getUserData();
        this.$setNavTitle('报名');
    },
    methods:{
        getApplyInfo() {
            let that = this;
            this.$axios.post('/mine/queryMineMatchInfo')
            .then(function (response) {
                var result = response.data.result;
                if(result.finishApply === 'yes') {
                    //已经报过名
                    that.isApply = true;
                }
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        // 获取员工信息
        getUserData:function(){
            if(!this.canApply) {
                return;
            }
            this.canApply = false;
            let that = this;
            this.$axios.get('match/obtainuserApplyInfo')
            .then(function (response) {
                let data = response.data.result;
                that.applyUpName = data.applyUpName;
                that.applyUpNum = data.applyUpNum;
                that.regional = data.regional;
                that.totalDivision = data.totalDivision;
                that.applyUpPhone = data.applyUpPhone;
                that.competitionArea =  that.totalDivision+ '-' + that.regional;
                localStorage.setItem('applyUpNum', that.applyUpNum)
                that.canApply = true;
            })
            .catch(function (error) {
                that.canApply = true;
                console.log(error);
            });
        },
        // 报名
        applyCompetition: function(){
            if(this.applyUpName === '') {
                this.$toast.show({
                    text: '姓名不能为空',
                    type: 'text'
                })
                return;
            } else if(this.applyUpNum === '') {
                this.$toast.show({
                    text: '工号不能为空',
                    type: 'text'
                })
                return;
            } else if(this.competitionAreaText === '') {
                this.$toast.show({
                    text: '赛区不能为空',
                    type: 'text'
                })
                return;
            } else if(this.applyUpPhone === '') {
                this.$toast.show({
                    text: '手机号不能为空',
                    type: 'text'
                })
                return;
            } else if(!(/^1(3|4|5|7|8|9)\d{9}$/).test(this.applyUpPhone)) {
                this.$toast.show({
                    text: '请输入正确手机号',
                    type: 'text'
                })
                return;
            }
            let that = this;
            this.$axios.post('match/userApply', {
                'phoneNumber': that.applyUpPhone
            })
            .then(function (response) {
                var data = response.data;
                console.log(data)
            
                if(data.succ === 'ok') {
                    that.changeStatus = [false,true]
                }
            })
            .catch(function (error) {
                console.log(error)
            });
            

        },
        
    },
    computed: {
        competitionAreaText() {
            if(this.totalDivision !== this.regional) {
                return this.totalDivision + '-' + this.regional;
            } else {
                return this.regional;
            }
        }
    }
}
</script>

<style lang='less' scoped>
.already-apply-tips{
    position: relative;
    width: 100%;
    height: 40px;
    line-height: 36px;
    padding: 3px 0;
    background-color: #fff;
    box-sizing: border-box;
    text-align: center;
    font-size: 16px;
    .icon-success{
        display: inline-block;
        width: 20px;
        height: 20px;
        vertical-align: -4px;
    }
}
.scroller-box {
    position: absolute;
    top: 46px;
    left: 0;
    right: 0;
    bottom: 0;
    box-sizing: border-box;
    overflow: hidden;
    height: 110px;
    background: #F5F5F9;
}
.scroller-x {
    width: 700px;
    height: 110px;
}
ul li{
  list-style: none;
}
.scroller-x li {
  float: left;
    margin: 10px;
    width: 120px;
    height: 90px;
    line-height: 90px;
    color: #fff;
    background: #04497B;
    font-size: 40px;
    text-align: center;
}
.hided{
    display: none;
}
.container{
    margin: 10px 15px;
    background: white;
    padding: 10px 0px;
    .input-box{
        border-bottom: 1px solid #f4f4f4;
        margin: 10px;
        padding-bottom: 15px;
        label{
            font-size: 18px;
            color: #212121;
            margin-right: 15px;
            padding-left: 15px;

        }
        input{
            font-size: 14px;
        }
        .phone{
            border: 1px solid #ccc;
            height: 40px;
            border-radius:5px;
            padding-left: 15px;
            -webkit-appearance: none;
        }
        
    }
    .success-img{
        width: 107px;
        height: 99px;
        margin: 25px auto;
        img{
            width: 100%;
            height: 100%;
        }
    }
    .tips{
        font-size: 20px;
        color: #212121;
        text-align: center;
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

}
input[type="text"]:disabled{
    background-color: transparent;
}
.to-link-tips{
    text-align: center;
    font-size: 14px;
    img{
        display: inline-block;
        width: 20px;
        height: auto;
        vertical-align: middle;
        margin-left: 6px;
    }
}
</style>

