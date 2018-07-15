<template>
    <div class="reportQuery">
        <template>
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-form :inline="true" class="waitAudit-form">
                    <el-form-item class="matchArea-select" label="赛区">
                        <el-cascader
                            :disabled="computedCanSelectArea"
                            expand-trigger="hover"
                            :options="matchAreaOption"
                            v-model="matchAreaSelect"
                            @change="selectMatchArea">
                        </el-cascader>
                    </el-form-item>
                    <el-form-item>
                            <el-input v-model="searchKeyword" placeholder="请输入关键字搜索" @change.native="initData"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click.native="search">查询</el-button>
                    </el-form-item>
                </el-form>
                <el-tab-pane label="待审核" name="first" class="waitAudit">
                    <div class="tab-wrap">
                        <el-table :data="waitAuditVideoData" border style="width: 100%">
                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column prop="applyUpNum" label="工号" > </el-table-column>
                            <el-table-column prop="applyUpName" label="姓名" > </el-table-column>
                            <el-table-column prop="unionDivision" label="赛区" > </el-table-column>
                            <el-table-column prop="manifestoTitle" label="视频标题" > </el-table-column>
                            <el-table-column prop="videoUrl" label="视频链接" >
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="checkVideo(scope.row.uuid)">查看</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="publishTime" label="上传时间" > </el-table-column>
                            <el-table-column prop="handle" label="操作" class="handle">
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="approveAudit(scope.row.uuid)">通过审核</el-button>
                                    <el-button type="danger" size="mini" @click="rejectAuditBtn(scope.row)">驳回审核</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block-pagination">
                        <el-pagination v-if="waitAuditVideoDataTotal !== 0" @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10,20, 50, 100]" :page-size="pageSize" layout="->,prev, pager, next, jumper, sizes,total" :total="waitAuditVideoDataTotal">
                        </el-pagination>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="已审核" name="second" class="alreadyAudit">
                    <div class="tab-wrap">
                        <el-table :data="alreadyAuditVideoData" border style="width: 100%">
                            <el-table-column type="index" label="序号" width="80"></el-table-column>
                            <el-table-column prop="applyUpNum" label="工号" > </el-table-column>
                            <el-table-column prop="applyUpName" label="姓名" > </el-table-column>
                            <el-table-column prop="unionDivision" label="赛区" > </el-table-column>
                            <el-table-column prop="manifestoTitle" label="视频标题" > </el-table-column>
                            <el-table-column prop="videoUrl" label="视频链接" >
                                <template slot-scope="scope">
                                    <el-button size="mini" @click="checkVideo(scope.row.uuid)">查看</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="publishStatus" label="审核结果" :formatter="formatter">
                                <!-- <template slot="scope">
                                    scope.row.publishStatus
                                </template> -->
                            </el-table-column>
                            <el-table-column prop="publishTime" label="上传时间" > </el-table-column>
                            <el-table-column prop="auditTime" label="审核时间" > </el-table-column>
                            <el-table-column prop="auditTime" label="操作" class="handle">
                                <template slot-scope="scope">
                                    <el-button type="danger" size="mini" @click="deleteMatchVideo(scope.row.uuid)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <div class="block-pagination">
                        <el-pagination @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage2" :page-sizes="[10,20, 50, 100]" :page-size="pageSize2" layout="->,prev, pager, next, jumper, sizes,total" :total="waitAuditVideoDataTotal2">
                        </el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </template>
        <el-dialog title="驳回视频上传申请" :visible.sync="dialogRejectVisible">
            <el-form>
                <el-form-item label="姓名" :label-width="formLabelWidth">
                    <el-input :disabled="true" v-model="rejectDialogData.applyUpName"></el-input>
                </el-form-item>
                <el-form-item label="视频标题" :label-width="formLabelWidth">
                    <el-input :disabled="true" v-model="rejectDialogData.manifestoTitle"></el-input>
                </el-form-item>
                <el-form-item label="驳回理由备注" :label-width="formLabelWidth">
                    <el-input type="textarea" v-model="rejectDialogData.remark" resize="none" rows="6"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRejectVisible = false">再 想 想</el-button>
                <el-button type="primary" @click="rejectAudit">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="播放视频" :visible.sync="dialogVideoWrap">
            <video class="element-video" autoplay :src="videoSrc"></video>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVideoWrap: false,
            videoSrc: '',
            formLabelWidth: '120px',
            activeName: 'first',
            tabIndex: '0',
            matchAreaOption: [],
            matchAreaSelect: [
                this.$store.state.global.area === '顺丰总部' ? '' : this.$store.state.global.area, 
                this.$store.state.global.subArea  === '顺丰总部' ? '' : this.$store.state.global.subArea
            ],
            waitAuditVideoData: [
                // {
                //     applyUpNum: '01375681',
                //     applyUpName: '李明明',
                //     unionDivision: '华南大区，深圳赛区',
                //     videoTitle: '平淡生活的英雄梦想',
                //     videoLink: 'http://www.baidu.com',
                //     uploadTime: '2018-01-02 13:03:02',
                // }
            ],
            totalDivision: this.$store.state.global.area === '顺丰总部' ? '' : this.$store.state.global.area, 
            regional: this.$store.state.global.area === '顺丰总部' ? '' : this.$store.state.global.area, 
            auditStatus: 'notpass',
            searchKeyword: '',
            currentPage: 1,
            pageSize: 10,
            waitAuditVideoDataTotal: 1,
            alreadyAuditVideoData: [
                // {
                //     applyUpNum: '01375681',
                //     applyUpName: '李明明',
                //     unionDivision: '华南大区，深圳赛区',
                //     videoTitle: '平淡生活的英雄梦想',
                //     videoLink: 'http://www.baidu.com',
                //     auditResult: '已通过',
                //     uploadTime: '2018-01-02 13:03:02',
                //     audiTime: '2018-01-02 16:20:58'
                // }
            ],
            currentPage2: 1,
            pageSize2: 10,
            waitAuditVideoDataTotal2: 0,
            dialogRejectVisible: false,
            rejectDialogData: {
                applyUpName: '',
                manifestoTitle: '',
                remark: ''
            },
            canSelectArea: true
        }
    },
    methods: {
        tabClick(tab) {
            if(tab.index === this.tabIndex) {
                return;
            }
            this.tabIndex = tab.index;
            if(tab.label === '待审核') {
                this.auditStatus = 'notpass';
            } else {
                this.auditStatus = 'pass';
            }
            this.getPageData();
        },
        selectMatchArea(val) {
            this.totalDivision = val[0];
            this.regional = val[1];
            this.getPageData();
            console.log(val)
        },
        getPageData() {
            let that = this;
            this.$axios.post('/workmatch/selectMatchVideoInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                totalDivision: this.totalDivision,
                regional: this.regional,
                likeStr: this.searchKeyword,
                auditStatus: this.auditStatus
            })
            .then((res) => {
                var data = res.data;
                var list = data.result.list;
                that.waitAuditVideoData = list;
                that.alreadyAuditVideoData = list;
                that.waitAuditVideoDataTotal = data.result.total;
                that.waitAuditVideoDataTotal2 = data.result.total;
            })
            .catch((err) => {
                console.log(err);
            })
        },
        search() {
            if(this.searchKeyword === '') {
                return;
            }
            this.getPageData();
        },
        initData() {
            if(this.searchKeyword === '') {
                this.getPageData();
            }
        },
        sizeChange(val) {
            this.pageSize = val;
            this.getPageData();
        },
        currentChange(val) {
            this.currentPage = val;
            this.getPageData();
        },
        approveAudit(uuid) {
            //通过审核
            this.$axios.post('/workmatch/auditApplyInfoPass', {
                uuid: uuid
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    this.getPageData();
                    this.$message({
                        message: '审核通过',
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.data.msg);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        rejectAuditBtn(item) {
            this.rejectDialogData.applyUpName = item.applyUpName;
            this.rejectDialogData.manifestoTitle = item.manifestoTitle;
            this.rejectDialogData.uuid = item.uuid;
            this.dialogRejectVisible = true;
            // console.log(item);
        },
        rejectAudit() {
            this.$axios.post('/workmatch/auditApplyInfoNotPass', {
                uuid: this.rejectDialogData.uuid,
                auditRemark: this.rejectDialogData.remark
            })
            .then((res) => {
                console.log(res.data.succ)
                if(res.data.succ === 'ok') {
                    this.$message({
                        message: '驳回成功',
                        type: 'warning'
                    });
                    this.dialogRejectVisible = false;
                    this.getPageData();
                } else {
                    this.$message.error('账号没有权限！');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        formatter(row) {
            if(row.publishStatus === 1) {
                return '已通过';
            } else if(row.publishStatus === 2) {
                return '已驳回';
            }
        },
        checkVideo(uuid) {
            this.$axios.post('/workmatch/getVideoUrl', {
                uuid: uuid
            })
            .then((res) => {
                var videoUrl = res.data.msg;
                this.videoSrc = videoUrl;
                this.dialogVideoWrap = true;
            })
        },
        deleteMatchVideo(uuid) {
            this.$confirm('此操作将删除该条赛事视频, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDeleteMatchVideo(uuid);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        confirmDeleteMatchVideo(uuid) {
            let that = this;
            this.$axios.post('/workmatch/deleteMatchVideo', {
                uuid: uuid
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    that.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    that.getPageData();
                } else {
                    that.$message.error('删除失败');
                }
            })
            .catch((err) => {
                that.$message.error('删除失败');
            })
        }
    },
    mounted() {
        console.log(this.$store.state.global.area)
        this.getPageData();
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
    },
    computed: {
        computedCanSelectArea() {
            if(this.$store.state.global.area === '顺丰总部') {
                return false;  
            } else {
                return true
            }
        }
    }
}
</script>

<style lang="less">
.matchArea-select{
    width: 80%;
}
.element-video{
    display: block;
    width: 100%;
}
</style>

