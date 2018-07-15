<template>
    <div>
         <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">赛事规则</v-navbar> -->
         <div class="rule-container">
            <div class="rule-content">
                <div class="rule-title">活动时间</div>
                <div class="time">2018年7月-2018年10月</div>
            </div>
            <div class="rule-content">
                <div class="rule-title">活动对象</div>
                <div class="target">全体顺丰员工</div>
            </div>
            <div class="rule-content">
                <div class="rule-title">活动阶段</div>
                <div class="active-stage">全员海选——积分晋级——终极挑战</div>
            </div>
            <div class="rule-content">
                <div class="rule-title">活动细则</div>
                <div class="rule-detail">
                    <h3 class="rules-detail-title">（一）全员海选</h3>
                    全体在职员工可通过线上平台参加活动，年龄、岗位、性别皆不限；全网划分为不同赛区，报名后默认加入岗位所在的赛区；
                    
                    <p class="content-title">如何参加：</p>
                    1. 在活动平台（丰声-微服务-“脸谱行动”），点击“我要参加”，确认个人信息，即可报名；<br/>
                    2. 报名成功，进入海选阶段；<br/>
                    3. 海选期间，选手须在线完成指定任务：<br/>
                    ①签署脸谱公约；<br/>
                    ②点亮脸谱行动头像；<br/>
                    ③发布我的脸谱宣言；<br/>
                    (注：展示形式为视频，15秒以内，展现员工价值观，工作技能，形象素质，公益行为。演绎顺丰脸谱，SF is U)
                    
                    <p class="content-title">赛制赛果：</p>
                    1. 用户上传的“我的脸谱宣言”视频，按获赞排名；<br/>
                    2. 海选为期1个月，结束时各赛区排名前5位的优秀选手，集结组成本赛区的代表战队，进入积分晋级阶段；<br/>
                    3. 未能组成战队的个人选手仍可继续参加后续活动，闯关积分，有机会“翻盘”组成英雄联盟战队；<br/>
                    
                    <h3 class="rules-detail-title">（二）积分晋级</h3>
                    在积分晋级阶段，选手可参与所有线上游戏，闯关获得客观得分，通过积分淘汰制，决出参与终极挑战的战队席位。<br/>
                    (注：关于积分晋级的详细说明，后续将进一步发布)
                    
                    <h3 class="rules-detail-title">（三）终极挑战</h3>
                    战队晋级完毕，本阶段将参加脸谱行动终极挑战，决赛形式为实地挑战活动。<br/>
                    (注：关于终极挑战的详细说明，后续将进一步发布)
                </div>    
            </div>
            <div class="rule-content">
                <div class="rule-title">注意事项</div>
                <div class="rule-detail">
                    1、活动期间出现任何舞弊行为的选手一经发现，即刻取消活动资格；<br/>
                    2、本活动最终解释权归顺丰集团员工关系处所有。
                </div>
            </div>
         </div>
    </div>
</template>

<script>
export default {
    data() {
        return {

        }
    },
    mounted() {
        this.$setNavTitle('赛事规则');
    }
}
</script>

<style lang='less' scoped>
.sfmui-header-title, .navbar-demo2 .sfmui-header h1 {
    color: #212121!important;
}
.rule-container{
    margin: 10px 15px;
    background: white;
     padding: 30px 0px;
    .rule-content{       
        .rule-title{ 
            width: 110px;
            color: white;
            font-size: 18px;
            padding: 2px 10px;
            background: #108ee9;
            border-radius: 0px 5px 5px 0px;
        }
        .time,
        .target,
        .active-stage{
            color: #878787;
            font-size: 14px;
            margin: 20px 0px;
            padding-left: 50px;
        }
        .rule-detail{
            padding: 6px 20px;
            box-sizing: border-box;
            font-size: 14px;
            color: #878787;
            line-height: 20px;
            .rules-detail-title {
                text-indent: -20px;
                color: #000;
                font-size: 14px;
                margin: 4px auto;
            }
            .content-title{
                color: #444;
                font-size: 14px;
                font-weight: bold;
                margin: 6px auto;
            }
        }
    }
}
</style>

