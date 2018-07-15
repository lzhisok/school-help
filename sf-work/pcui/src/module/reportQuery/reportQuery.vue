<template>
    <div class="reportQuery">
        <template>
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="报名信息" name="first" class="enroll">
                    <el-form :inline="true" class="top-form">
                        <el-form-item class="button-wrap">
                            <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
                            <el-button type="primary" size="small" @click="exportTable">导出</el-button>
                        </el-form-item>
                        <el-form-item>
                             <el-input v-model="searchKeyword" placeholder="请输入关键字搜索" @change.native="initData"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.native="search">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="tab-wrap">
                        <el-table :data="enrollTableData" border style="width: 100%">
                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column prop="applyUpNum" label="工号" > </el-table-column>
                            <el-table-column prop="applyUpName" label="姓名" > </el-table-column>
                            <el-table-column prop="unionDivision" label="赛区" > </el-table-column>
                            <el-table-column prop="applyUpPhone" label="手机号" > </el-table-column>
                            <el-table-column prop="applyUpTime" label="报名时间" > </el-table-column>
                        </el-table>
                    </div>
                    <div class="block-pagination">
                        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10,20, 50, 100]" :page-size="pageSize" layout="->,prev, pager, next, jumper, sizes,total" :total="enrollTableDataTotal">
					    </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane  label="地区排行榜" name="second" class="areaRank">
                    <el-form :inline="true" class="top-form">
                        <el-form-item class="button-wrap">
                            <el-button type="primary" size="small" @click="exportRankTable">导出</el-button>
                        </el-form-item>
                        <el-form-item class="matchArea-select" label="赛区">
                            <el-cascader
                                expand-trigger="hover"
                                :options="matchAreaOption"
                                v-model="matchAreaSelect"
                                @change="selectMatchArea">
                            </el-cascader>
                            <!-- <so-dic type="select" v-model="matchAreaSelect" selFirst='顺丰科技' path="match_type" @change="selectMatchArea"></so-dic> -->
                        </el-form-item>
                        <el-form-item>
                             <el-input v-model="searchKeywordRank" placeholder="请输入关键字搜索" @change.native="initRankData"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click.native="searchRandData">查询</el-button>
                        </el-form-item>
                    </el-form>
                    <div class="tab-wrap">
                        <el-table :data="rankTableData" border style="width: 100%">
                            <el-table-column type="index" label="排名" width="80"></el-table-column>
                            <el-table-column prop="applyUpNum" label="工号" > </el-table-column>
                            <el-table-column prop="applyUpName" label="姓名" > </el-table-column>
                            <el-table-column prop="unionDivision" label="赛区" > </el-table-column>
                            <el-table-column prop="likeNum" label="点赞值" > </el-table-column>
                        </el-table>
                    </div>
                    <div class="block-pagination">
                        <el-pagination @size-change="sizeChangeRank" @current-change="currentChangeRank" :current-page="currentPage1" :page-sizes="[10,20, 50, 100]" :page-size="pageSize1" layout="->,prev, pager, next, jumper, sizes,total" :total="rankTableDataTotal">
					    </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
        <el-dialog title="添加报名信息" :visible.sync="dialogAddVisible">
            <el-form>
                <el-form-item label="工号" :label-width="formLabelWidth">
                    <el-input v-model="newEnrollInfo.applyUpNum" placeholder="请输入工号" @blur="getUserWidthNum"></el-input>
                </el-form-item>
                
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input v-model="newEnrollInfo.applyUpName" placeholder="请输入用户名称" disabled></el-input>
                </el-form-item>

                <el-form-item label="赛区" :label-width="formLabelWidth">
                    <el-input v-model="newEnrollInfo.unionDivision" placeholder="请输入赛区" disabled></el-input>
                </el-form-item>

                <el-form-item label="手机号" :label-width="formLabelWidth">
                    <el-input v-model="newEnrollInfo.applyUpPhone" placeholder="请输入手机号码"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddEnroll">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Qs from 'qs';
import soDic from '../../components/soDic.vue'
export default {
    data() {
        return {
            formLabelWidth: '120px',
            tabIndex: '0',
            activeName: 'first',
            pageSize: 10,
            currentPage: 1,
            enrollTableDataTotal: 0,
            searchKeyword: '',
            enrollTableData: [],
            //地区排行榜
            matchAreaOption: [{
                value: '华南大区',
                label: '华南大区',
                children: [{
                    value: '深圳赛区',
                    label: '深圳赛区',
                },
                {
                    value: '广州赛区',
                    label: '广州赛区',
                }]
            }],
            matchAreaSelect: [this.$store.state.global.area, this.$store.state.global.subArea],
            rankTableData: [],
            pageSize1: 10,
            currentPage1: 1,
            rankTableDataTotal: 0,
            searchKeywordRank: '',
            totalDivision: this.$store.state.global.area,
            regional: this.$store.state.global.subArea,
            dialogAddVisible: false,
            newEnrollInfo: {
                applyUpNum: '',
                applyUpName: '',
                unionDivision: '',
                applyUpPhone: ''
            }
        }
    },
    methods: {
        tabClick(tab) {
            if(tab.index === this.tabIndex) {
                return;
            }
            this.tabIndex = tab.index;
            if(tab.label === '报名信息') {
                this.getPageData();
            } else {
                this.getRankData();
                var largeArea = this.$dicTool().getSeletList('match_type');
                largeArea.forEach((item, index) => {
                    var matchArea = this.$dicTool().getSeletList('match_type.' + largeArea[index].value);
                    largeArea[index].value = largeArea[index].label
                    largeArea[index].children = matchArea
                    largeArea[index].children.forEach((item, childIndex) => {
                        largeArea[index].children[childIndex].value = largeArea[index].children[childIndex].label
                    })
                });
                this.matchAreaOption = largeArea
                console.log(this.matchAreaOption)
            }
        },
        getPageData() {
            let that = this;
            this.$axios.post('/workreportquery/selectMatchInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize
            })
            .then((res) => {
                var data = res.data;
                var list = data.result.list;
                that.enrollTableData = list;
                that.enrollTableDataTotal = data.result.total;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        initData() {
            if(this.searchKeyword === '') {
                this.getPageData();
            }
        },
        search() {
            if(this.searchKeyword === '') {
                return;
            }
            let that = this;
            this.$axios.post('/workreportquery/selectMatchInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                likeStr: this.searchKeyword
            })
            .then((res) => {
                var data = res.data;
                var list = data.result.list;
                that.enrollTableData = list;
                that.enrollTableDataTotal = data.result.total;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        exportTable() {
            //导出数据
            let that = this;
            this.$axios.get('/workreportquery/exportMatchInfo', {
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
            link.setAttribute('download', '报名表.xlsx');

            document.body.appendChild(link);
            link.click();
        },
        sizeChange(val) {
            this.pageSize = val;
            this.getPageData();
        },
        currentChange(val) {
            console.log(val)
            this.currentPage = val
            this.getPageData();
        },
        //地区排行榜
        getRankData() {
            let that = this;
            this.$axios.post('/workreportquery/selectRegionTopInfo', {
                pageSize: this.pageSize1,
                currentPage: this.currentPage1,
                totalDivision: this.totalDivision,
                regional: this.regional,
                likeStr: this.searchKeywordRank
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    var data = res.data;
                    var list = data.result.list;
                    that.rankTableData = list;
                    that.rankTableDataTotal = data.result.total
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        selectMatchArea(val) {
            this.totalDivision = val[0];
            this.regional = val[1];
            this.getRankData();
            console.log(val)
        },
        exportRankTable() {
            //导出地区排行榜
            let that = this;
            this.$axios.post('/workreportquery/exportRegionTopInfo', {
                    totalDivision: this.totalDivision,
                    regional: this.regional,
                }, {
                responseType: 'blob'
            })
            .then((res) => {
                that.downloadFile(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
        },
        initRankData() {
            if(this.searchKeywordRank === '') {
                this.getRankData();
            }
        },
        searchRandData() {
            if(this.searchKeywordRank === '') {
                return;
            }
            this.getRankData();
        },
        sizeChangeRank(val) {
            this.pageSize1 = val;
            this.getRankData();
        },
        currentChangeRank(val) {
            this.currentPage1 = val
            this.getRankData();
        },
        getUserWidthNum(e) {
            //通过工号获得姓名和赛区
            if(e.target.value === '') {
                this.$message.error('请输入正确的工号');
                return;
            }
            let that = this;
            this.$axios.post('/workreportquery/selectEmpInfo', {
                queryUserNo: this.newEnrollInfo.applyUpNum
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var result = res.data.result;
                    that.newEnrollInfo.applyUpName = result.applyUpName
                    that.newEnrollInfo.unionDivision = result.totalDivision + ', ' + result.regional
                } else {
                    this.$message.error('请输入正确的工号！');
                }
            })
            .catch((err) => {
                console.log(err);
            })

        },
        handleAdd() {
            this.dialogAddVisible = true
        },
        confirmAddEnroll() {
            let that = this;
            if(this.newEnrollInfo.applyUpNum === '') {
                this.$message.error('请输入工号');
                return;
            }
            if(this.newEnrollInfo.applyUpPhone === '') {
                this.$message.error('请输入手机号码');
                return;
            }
            this.$axios.post('/workreportquery/userApply', {
                queryUserNo: this.newEnrollInfo.applyUpNum,
                phoneNumber: this.newEnrollInfo.applyUpPhone
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    this.$message({
                        message: '添加报名信息成功',
                        type: 'success'
                    });
                    this.dialogAddVisible = false;
                    that.getPageData();
                } else if(data.msg === '您已报名，请勿重复报名') {
                    this.$message({
                        message: data.msg,
                        type: 'warning'
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
        }
    },
    components: {
        soDic
    },
    mounted() {
        this.getPageData();
    },
    
}
</script>

<style lang="less">
.el-tabs__content{
    padding-top: 0;
}

.enroll{
    .button-wrap{
        width: 80%;
    }
}
.areaRank{
    .button-wrap{
        width: 63%;
    }
}
// .block-pagination{
//     float: right;
// }
</style>

