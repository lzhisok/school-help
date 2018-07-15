<template>
    <div class="statistc">
        <template>
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="用户统计" name="first" class="userStatistics">
                    <el-form :inline="true" class="userStatistics-form">
                        <el-form-item class="btn-date-wrap" label="最近">
                            <el-radio-group v-model="currentDay" size="medium" @change="selectDayNum">
                                <el-radio-button label="7天"></el-radio-button>
                                <el-radio-button label="30天"></el-radio-button>
                                <el-radio-button label="60天"></el-radio-button>
                                <el-radio-button label="90天"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="其他">
                            <el-date-picker @change="selectTimeSlot" value-format="yyyy-MM-dd" v-model="timeSlot" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <v-chart :force-fit="true" :height="height" :data="userChartData" :scale="userScale">
                        <v-tooltip />
                        <v-axis />
                        <v-legend />
                        <v-line position="date*num" color="user" />
                        <v-point position="date*num" color="user" :size="4" :v-style="style" :shape="'circle'" />
                    </v-chart>
                    <el-table show-summary :data="userStatisticsTableData"  style="width: 100%" border>
                        <el-table-column prop="statistics" label="日期"></el-table-column>
                        <el-table-column prop="addUserCount" label="新增用户量" ></el-table-column>
                        <el-table-column prop="totalUserCount" label="用户总量" ></el-table-column>
                        <el-table-column prop="dayActiveCount" label="日活跃用户量" ></el-table-column>
                    </el-table>
                    <el-pagination @size-change="sizeChangeUserTable" @current-change="currentChangeUserTable" :current-page="currentPageUserTable" :page-sizes="[10,20, 50, 100]" :page-size="pageSizeUserTable" layout="->,prev, pager, next, jumper, sizes,total" :total="userTableTotal">
                    </el-pagination>
                </el-tab-pane>
                <el-tab-pane label="流量统计" name="second" class="flowStatistics">
                     <el-form :inline="true" class="flowStatistics-form">
                        <el-form-item label="页面统计" class="page-dropdown">
                            <el-dropdown @command="pageDropdown">
                                <span class="el-dropdown-link">
                                    {{flowTypeName}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="0">全站</el-dropdown-item>
                                    <el-dropdown-item command="1">赛事</el-dropdown-item>
                                    <el-dropdown-item command="2">社区</el-dropdown-item>
                                    <el-dropdown-item command="3">排行榜</el-dropdown-item>
                                    <el-dropdown-item command="4">我的</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </el-form-item>
                        <el-form-item class="btn-date-wrap" label="最近">
                            <el-radio-group v-model="currentDayFlow" size="medium" @change="selectDayNumFlow">
                                <el-radio-button label="7天"></el-radio-button>
                                <el-radio-button label="30天"></el-radio-button>
                                <el-radio-button label="60天"></el-radio-button>
                                <el-radio-button label="90天"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="其他">
                            <el-date-picker @change="selectTimeSlotFlow" value-format="yyyy-MM-dd" v-model="timeSlotFlow" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="btn-export">
                            <el-button type="primary" size="small" @click="exportFlowInfo">导出数据</el-button>
                        </el-form-item>
                    </el-form>
                    <v-chart :force-fit="true" :height="height" :data="flowChartData" :scale="flowScale" class="flow-chart">
                        <v-tooltip />
                        <v-axis />
                        <v-legend />
                        <v-line position="date*num" color="visitNum" />
                        <v-point position="date*num" color="visitNum" :size="4" :v-style="style" :shape="'circle'" />
                    </v-chart>
                    <el-table show-summary :data="flowLikePostData"  style="width: 100%" border v-if="flowType == 1 ||flowType == 2">
                        <el-table-column prop="statistics" label="时间" ></el-table-column>
                        <el-table-column prop="like_count" label="点赞数"></el-table-column>
                        <el-table-column prop="comment_count" label="评论数" ></el-table-column>
                        <el-table-column prop="post_count" label="日增量" ></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="报名统计" name="third" class="enrollStatistics">
                    <el-form :inline="true" class="enrollStatistics-form">
                        <el-form-item class="btn-date-wrap" label="最近">
                            <el-radio-group v-model="currentDayEnroll" size="medium" @change="selectDayNumEnroll">
                                <el-radio-button label="7天"></el-radio-button>
                                <el-radio-button label="30天"></el-radio-button>
                                <el-radio-button label="60天"></el-radio-button>
                                <el-radio-button label="90天"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="其他">
                            <el-date-picker @change="selectTimeSlotEnroll" value-format="yyyy-MM-dd" v-model="timeSlotEnroll" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-form>
                    <el-col :span="12" class="enroll-table-wrap">
                        <el-table :data="enrollTableData" border style="width: 100%">
                            <el-table-column prop="totalPageVisitCount" label="浏览人数" ></el-table-column>
                            <el-table-column prop="totalMatchApplyCount" label="报名人数" ></el-table-column>
                            <el-table-column prop="totalFinishTaskCount" label="完成海选任务人数"></el-table-column>
                        </el-table>
                        <el-table :data="enrollTableData" border style="width: 100%">
                            <el-table-column prop="totalUploadVideoCount" label="上传海选视频人数" ></el-table-column>
                            <el-table-column prop="totalVideoPassCount" label="视频通过人数" ></el-table-column>
                            <el-table-column></el-table-column>
                        </el-table>
                    </el-col>
                    <el-col :span="10" class="enroll-leak-wrap">
                        <v-chart :force-fit="true" style="margin-left:100px" height="260" :padding="[ 20, 120, 95 ]" :data="leakChartData" :scale="leakScale">
                            <v-tooltip :show-title="false" :item-tpl="tooltipOpts.itemTpl" />
                            <v-legend />
                            <v-coord type="rect" direction="LT" />
                            <v-pyramid :position="funnelOpts.position" :color="funnelOpts.color" :label="funnelOpts.label" :tooltip="funnelOpts.tooltip" />
                            <v-guide v-for="(obj, index) in leakChartData"
                                :key="index"
                                type="text"
                                :top="true"
                                :position="getPosition(obj)"
                                :content="getContent(obj)"
                                :vStyle="{
                                fill: '#fff',
                                fontSize: '12',
                                textAlign: 'center',
                                shadowBlur: 2,
                                shadowColor: 'rgba(0, 0, 0, .45)'
                                }"
                            />
                            <div class="upload-video-conversion">
                                上传视频转化率
                                <span>{{uploadVideoConversion}}</span>
                            </div>
                            <div class="video-pass-conversion">
                                视频通过率
                                <span>{{videoPassConversion}}</span>
                            </div>
                        </v-chart>
                    </el-col>
                    <div class="enroll-chart-wrap">
                        <v-chart :force-fit="true" :height="height" :data="enrollChartData" :scale="enrollScale" class="enroll-chart">
                            <v-tooltip />
                            <v-axis />
                            <v-legend />
                            <v-line position="date*num" color="personNum" />
                            <v-point position="date*num" color="personNum" :size="4" :v-style="style" :shape="'circle'" />
                        </v-chart>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
    </div>
</template>

<script>
import DataSet from '@antv/data-set';
import Qs from 'qs';
export default {
    data() {
        return {
            tabIndex: '0',
            activeName: 'first',
            //用户统计
            currentDay: '7天',
            userDay:7,
            timeSlot: '',
            height: 400,
            style: { stroke: '#fff', lineWidth: 1 },
            userSourceData: [
                // { date: '06/14', '新增用户量': 10, '用户总量': 42, '日活跃用户量': 20 },
                // { date: '06/15', '新增用户量': 25, '用户总量': 58, '日活跃用户量': 32 },
                // { date: '06/16', '新增用户量': 14, '用户总量': 69, '日活跃用户量': 27 },
                // { date: '06/17', '新增用户量': 9, '用户总量': 57, '日活跃用户量': 19 },
                // { date: '06/18', '新增用户量': 16, '用户总量': 48, '日活跃用户量': 24 },
                // { date: '06/19', '新增用户量': 20, '用户总量': 60, '日活跃用户量': 25 },
                // { date: '06/20', '新增用户量': 18, '用户总量': 70, '日活跃用户量': 40 },
                // { date: '06/21', '新增用户量': 10, '用户总量': 42, '日活跃用户量': 20 },
                // { date: '06/22', '新增用户量': 25, '用户总量': 58, '日活跃用户量': 32 },
                // { date: '06/23', '新增用户量': 14, '用户总量': 69, '日活跃用户量': 27 },
                // { date: '06/24', '新增用户量': 9, '用户总量': 57, '日活跃用户量': 19 },
                // { date: '06/25', '新增用户量': 16, '用户总量': 48, '日活跃用户量': 24 },
                // { date: '06/26', '新增用户量': 20, '用户总量': 60, '日活跃用户量': 25 },
                // { date: '06/27', '新增用户量': 18, '用户总量': 70, '日活跃用户量': 40 },
                //  { date: '06/28', '新增用户量': 10, '用户总量': 42, '日活跃用户量': 20 },
                // { date: '06/29', '新增用户量': 25, '用户总量': 58, '日活跃用户量': 32 },
                // { date: '06/30', '新增用户量': 14, '用户总量': 69, '日活跃用户量': 27 },
                // { date: '07/01', '新增用户量': 9, '用户总量': 57, '日活跃用户量': 19 },
                // { date: '07/02', '新增用户量': 16, '用户总量': 48, '日活跃用户量': 24 },
                // { date: '07/03', '新增用户量': 20, '用户总量': 60, '日活跃用户量': 25 },
                // { date: '07/04', '新增用户量': 18, '用户总量': 70, '日活跃用户量': 40 },
            ],
            userChartData: [],
            userScale: [{
                dataKey: 'date',
            }],
            userDv: {},
            userStatisticsTableData: [
                // {
                //     date: '2018-05-23',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // },
                // {
                //     date: '2018-05-24',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // },
                // {
                //     date: '2018-05-25',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // },
                // {
                //     date: '2018-05-25',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // },
                // {
                //     date: '2018-05-25',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // },
                // {
                //     date: '2018-05-25',
                //     newUser: 100,
                //     allUser: 43012,
                //     dailyActiveUser: 223
                // }
            ],
            currentPageUserTable: 1,
            pageSizeUserTable: 10,
            userTableTotal: 3,
            //流量统计
            currentDayFlow: '7天',
            flowDay:7,
            flowType:0,
            timeSlotFlow: '',
            flowSourceData: [
                // { date: '2018-06-14', '浏览次数(PV)': 400, '独立访客(UV)': 252},
                // { date: '2018-06-15', '浏览次数(PV)': 300, '独立访客(UV)': 246},
                // { date: '2018-06-16', '浏览次数(PV)': 600, '独立访客(UV)': 338},
                // { date: '2018-06-17', '浏览次数(PV)': 100, '独立访客(UV)': 159},
                // { date: '2018-06-18', '浏览次数(PV)': 200, '独立访客(UV)': 571},
                // { date: '2018-06-19', '浏览次数(PV)': 150, '独立访客(UV)': 458},
                // { date: '2018-06-20', '浏览次数(PV)': 460, '独立访客(UV)': 358},
            ],
            flowChartData: [],
            flowTypeName:"全部",
            flowScale: [{
                dataKey: 'date1',
                min: 0,
                max: 1,
            }],
            flowDv: {},
            //报名统计
            currentDayEnroll: '7天',
            timeSlotEnroll: '',
            enrollSourceData: [
                { date: '06/14', '视频通过人数': 400, '报名人数': 252, '浏览人数': 354, '完成海选任务人数': 196, '上传海选视频人数': 178},
                { date: '06/15', '视频通过人数': 124, '报名人数': 585, '浏览人数': 45, '完成海选任务人数': 454, '上传海选视频人数': 548},
                { date: '06/16', '视频通过人数': 482, '报名人数': 372, '浏览人数': 465, '完成海选任务人数': 266, '上传海选视频人数': 255},
                { date: '06/17', '视频通过人数': 178, '报名人数': 392, '浏览人数': 67, '完成海选任务人数': 98, '上传海选视频人数': 78},
                { date: '06/18', '视频通过人数': 267, '报名人数': 431, '浏览人数': 282, '完成海选任务人数': 285, '上传海选视频人数': 398},
                { date: '06/19', '视频通过人数': 464, '报名人数': 47, '浏览人数': 564, '完成海选任务人数': 158, '上传海选视频人数': 378},
                { date: '06/20', '视频通过人数': 257, '报名人数': 457, '浏览人数': 457, '完成海选任务人数': 454, '上传海选视频人数': 548},
            ],
            enrollChartData: [],
            enrollScale: [{
                dataKey: 'date2',
                min: 0,
                max: 1,
            }],
            enrollDv: {},
            enrollDv:0,
            enrollTableData: [
                {
                    visitNum: 19830,
                    enrollNum: 3860,
                    finishTaskNum: 2310,
                    uploadVideoNum: 386,
                    videoPassNum: 163
                }
            ],
            leakSourceData: [
                { action: '报名', pv: 50000 },
                { action: '上传视频', pv: 35000 },
                { action: '审核通过', pv: 25000 },
            ],
            leakChartData: [],
            leakScale: [{
                dataKey: 'percent',
                nice: false,
            }],
            leakDv: {},
            tooltipOpts: {
                showTitle: false,
                itemTpl: '<li data-index={index} style="margin-bottom:4px;">'
                    + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
                    + '{name}<br/>'
                    + '<span style="padding-left: 16px">浏览人数：{pv}</span><br/>'
                    + '<span style="padding-left: 16px">占比：{percent}</span><br/>'
                    + '</li>'
            },
            funnelOpts: {
                position: 'action*percent',
                color: ['action', ['#0050B3', '#1890FF', '#40A9FF']],
                label: ['action*pv', (action, pv) => {
                    // return action + ' ' + pv;
                }, {
                    offset: 35,
                    labelLine: {
                    lineWidth: 1,
                    stroke: 'rgba(0, 0, 0, 0.15)',
                    }
                }],
                tooltip: ['action*pv*percent', (action, pv, percent) => ({
                    name: action,
                    percent: Math.floor(percent * 100) + '%',
                    pv: pv,
                })]
            },
            flowLikePostData: [
                // {
                //     statistics: '2018-07-06',
                //     like_count: 25,
                //     comment_count: 15,
                //     post_count: 54
                // }
            ]
        }
    },
    methods: {
        tabClick(tab) {
            if(tab.index === this.tabIndex) {
                return;
            }
            this.tabIndex = tab.index;
            if(tab.label === '用户统计') {
                this.getUserStatistics();
            } else if(tab.label === '流量统计') {
                this.getFlowStatistics();
            } else {
                this.getEnrollStatistics();
            }
        },
        //用户统计
        initUserChart() { //用户统计echart渲染
            this.userDv = new DataSet.View().source(this.userSourceData);
            this.userDv.transform({
                type: 'fold',
                fields: ['新增用户量', '用户总量', '日活跃用户量'],
                key: 'user',
                value: 'num',
            });
            this.userChartData = this.userDv.rows;
        },
        getUserStatistics() { //用户统计echart
            let that = this;
            if(this.currentDay == "7天"){
                this.userDay = 7
            }else if(this.currentDay == "30天"){
                this.userDay = 30
            }else if(this.currentDay == "60天"){
                this.userDay = 60
            }else{
                this.userDay = 90
            }
            this.$axios.post('/statistic/queryUserByCondition', {
                day: that.userDay,
                starttime:that.timeSlot[0]||"",
                endtime:that.timeSlot[1]||"",
            }).then((res) => {
                for(var i=0; i< res.data.result.list.length;i++){
                    that.userSourceData.push({
                        date: res.data.result.list[i].statistics, '新增用户量': res.data.result.list[i].addUserCount, '用户总量': res.data.result.list[i].totalUserCount, '日活跃用户量': res.data.result.list[i].dayActiveCount 
                    })
                }
                that.initUserChart();
            }).catch((err) => {
                console.log(err);
            })
        },
        getUserTable(){ //用户统计table
           let that = this;
            this.$axios.post('/statistic/queryUserByCondition', {
                currentPage:that.currentPageUserTable,
                pageSize:that.pageSizeUserTable
            }).then((res) => {
                that.userStatisticsTableData=res.data.result.list;
                that.userTableTotal = res.data.result.total;
            }).catch((err) => {
                console.log(err);
            })  
        },
        selectTimeSlot() { //用户统计时间筛选
           this.getUserStatistics();
        },
        selectDayNum(val) { //用户统计条件筛选
            var end = new Date();
            var startTime;
            var start = new Date();
            if(val === '7天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 7;
            } else if(val === '30天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 30;
            } else if(val === '60天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 60;
            } else if(val === '90天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 90;
            }
            start.setTime(startTime);
            console.log(start.toLocaleDateString().split('/').join('-'));
            this.userSourceData = [];
            this.getUserStatistics();
        },
        sizeChangeUserTable(val) { //用户统计分页点击
            this.pageSizeUserTable = val;
            this.getUserTable();
        },
        currentChangeUserTable(val) { //用户统计分页
            this.currentPageUserTable = val;
             this.getUserTable();
        },
        //流量统计
        initFlowChart() { //流量统计echart渲染
            this.flowDv = new DataSet.View().source(this.flowSourceData);
            this.flowDv.transform({
                type: 'fold',
                fields: ['浏览次数(PV)', '独立访客(UV)'],
                key: 'visitNum',
                value: 'num',
            });
            this.flowChartData = this.flowDv.rows;
        },
        getFlowStatistics() { //流量统计筛选
            if(this.currentDayFlow == "7天"){
                this.flowDay = 7
            }else if(this.currentDayFlow == "30天"){
                this.flowDay = 30
            }else if(this.currentDayFlow == "60天"){
                this.flowDay = 60
            }else{
                this.flowDay = 90
            }
            this.flowSourceData = [];
            let that = this;
            this.$axios.post('/statistic/queryFlowByCondition', {
                type:that.flowType,
                day: that.flowDay,
                starttime:that.timeSlotFlow[0]||"",
                endtime:that.timeSlotFlow[1]||"",
            }).then((res) => {
                var result = res.data.result;
                console.log(result)
                that.flowLikePostData = [];
                for(var i=0; i< res.data.result.length;i++){
                   that.flowSourceData.push({
                       date: res.data.result[i].statistics, '浏览次数(PV)': res.data.result[i].visit_page_count, '独立访客(UV)':  res.data.result[i].visit_user_count
                   })
                   var obj = {
                       statistics: result[i].statistics,
                       like_count: result[i].like_count,
                       comment_count: result[i].comment_count,
                       post_count: result[i].post_count,
                   }
                   that.flowLikePostData.push(obj)
               }
               console.log(that.flowLikePostData)
                this.initFlowChart();
            }).catch((err) => {
                console.log(err);
            })
        },

        exportFlowInfo(){ //流量导出
             if(this.currentDayFlow == "7天"){
                this.flowDay = 7
            }else if(this.currentDayFlow == "30天"){
                this.flowDay = 30
            }else if(this.currentDayFlow == "60天"){
                this.flowDay = 60
            }else{
                this.flowDay = 90
            }
            var timeSlotFlow1 = this.timeSlotFlow[0]||"";
            var timeSlotFlow2 = this.timeSlotFlow[1]||"";
            // window.location.href = "/statistic/exportFlowInfo?day="+this.flowDay+"&starttime="+timeSlotFlow1+"&endtime="+timeSlotFlow2
             //导出数据
            let that = this;
            this.$axios.post('/statistic/exportFlowInfo', {
                day: that.flowDay,
                starttime:timeSlotFlow1,
                endtime:timeSlotFlow2
            },{
                responseType: 'blob'
            })
            .then((res) => {
                that.downloadFile(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        },
        downloadFile(data) {
            if(!data) {
                return;
            }
            let url = URL.createObjectURL(new Blob([data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', '流量统计信息.xlsx');

            document.body.appendChild(link);
            link.click();
        },
        selectTimeSlotFlow(val) {
            this.getFlowStatistics();
        },
        selectDayNumFlow(val) {
            var end = new Date();
            var startTime = '';
            console.log(this.currentDayFlow)
            if(val === '7天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 7;
            } else if(val === '30天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 30;
            } else if(val === '60天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 60;
            } else if(val === '90天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 90;
            }
            this.getFlowStatistics();
        },
        pageDropdown(command) {
            console.log(command);
            this.flowType = command;
            if(command == 0){
                this.flowTypeName = "全部";
            }else if(command == 1){
                this.flowTypeName = "赛事";
            }else if(command == 2){
                this.flowTypeName = "社区";
            }else if(command == 3){
                this.flowTypeName = "排行榜";
            }else{
                this.flowTypeName = "我的";
            }
            this.getFlowStatistics();
        },

        //报名统计
        initEnrollChart() {
            this.enrollDv = new DataSet.View().source(this.enrollSourceData);
            this.enrollDv.transform({
                type: 'fold',
                fields: ['视频通过人数', '报名人数', '浏览人数', '完成海选任务人数', '上传海选视频人数'],
                key: 'personNum',
                value: 'num',
            });
            this.enrollChartData = this.enrollDv.rows;
            //漏斗图
            this.leakDv = new DataSet.View().source(this.leakSourceData);
            this.leakDv.transform({
                type: 'percent',
                field: 'pv',
                dimension: 'action',
                as: 'percent'
            });
            this.leakChartData = this.leakDv.rows;
        },
        getEnrollStatistics() {
            if(this.currentDayEnroll == "7天"){
                this.enrollDv = 7
            }else if(this.currentDayEnroll == "30天"){
                this.enrollDv = 30
            }else if(this.currentDayEnroll == "60天"){
                this.enrollDv = 60
            }else{
                this.enrollDv = 90
            }
             let that = this;
            this.$axios.post('/statistic/queryApplyByCondition', {
                day: that.enrollDv,
                starttime:that.timeSlotEnroll[0]||"",
                endtime:that.timeSlotEnroll[1]||"",
            }).then((res) => {
                that.enrollTableData = [];
                that.leakSourceData = [];
                that.enrollSourceData = [];
                if(res.data.result.length>0){
                     that.enrollTableData.push(res.data.result[0]);
                    that.leakSourceData.push(
                            { action: '报名', pv:res.data.result[0].totalMatchApplyCount},
                            { action: '上传视频', pv:res.data.result[0].totalUploadVideoCount },
                            { action: '审核通过', pv:res.data.result[0].totalVideoPassCount },
                        )
                    for(var i=0; i< res.data.result.length;i++){
                        that.enrollSourceData.push(
                                { date: res.data.result[i].statisticsDate, '视频通过人数': res.data.result[i].videoPassCount, '报名人数': res.data.result[i].matchApplyCount, '浏览人数': res.data.result[i].pageVisitCount, '完成海选任务人数': res.data.result[i].finishTaskCount, '上传海选视频人数': res.data.result[i].uploadVideoCount},
                        )
                        
                    }
                }else{
                     that.leakSourceData.push(
                            { action: '报名', pv:0},
                            { action: '上传视频', pv:0 },
                            { action: '审核通过', pv:0 },
                        )
                }
                that.initEnrollChart();
            }).catch((err) => {
                console.log(err);
            })
        
        },
        selectTimeSlotEnroll(val) {
            this.getEnrollStatistics();
        },
        selectDayNumEnroll(val) {
            var end = new Date();
            var startTime = '';
            if(val === '7天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 7;
            } else if(val === '30天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 30;
            } else if(val === '60天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 60;
            } else if(val === '90天') {
                startTime = end.getTime() - 3600 * 1000 * 24 * 90;
            }
            this.getEnrollStatistics();
        },
        getPosition: (obj) => {
            return {
                action: obj.action,
                percent: 'median'
            };
        },
        getContent: (obj) => {
            // return parseInt(String(obj.percent * 100)) + '%';
            return obj.action
        }
    },
    mounted() {
        this.getUserStatistics();
        this.getUserTable();
    },
    computed: {
        uploadVideoConversion() { 
            if(this.leakSourceData[0].pv == 0){
                return "--";
            }else{
                return (this.leakSourceData[1].pv/this.leakSourceData[0].pv * 100).toFixed(2) + '%';
            }
           
        },
        videoPassConversion() { 
             if(this.leakSourceData[1].pv == 0){
                return "--";
            }else{
                 return (this.leakSourceData[2].pv/this.leakSourceData[1].pv * 100).toFixed(2)  + '%';
            }
           
        }
    },
    watch: {
        userSourceData: 'initUserChart'
    }
}
</script>

<style lang="less">
.page-dropdown{
    width: 24%;
}
.btn-export{
    float: right;
}
.flow-chart{
    margin-top: 100px;
}
.enroll-table-wrap{
    margin-bottom: 30px;
    text-align: center;
    .el-table__header{
        th{
            background-color:#efefef;
            text-align: center;
        }
    }
}
.enroll-chart-wrap{
    clear: both;
}
.enroll-leak-wrap {
    position: relative;
}
.upload-video-conversion,
.video-pass-conversion{
    position: absolute;
    color: #9a9a9a;
    font-size: 14px;
    left: 84%;
    span{
        display: block;
    }
}

.upload-video-conversion{
    top: 50px;
}
.video-pass-conversion{
    top: 100px;
}
</style>

