<template>
    <div class="reportQuery" ref="reportQuery">
        <template>
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="帖子管理" name="first" class="cardManage">
                    <el-tabs v-model="activeCardName" class="card-tab" type="border-card"  @tab-click="cardTabClick">
                        <el-tab-pane label="图文帖子" name="first" class="card-tab-imageText">
                            <el-form :inline="true" class="cardImageText-form">
                                <el-form-item class="cardImageText-total-num">
                                    图文帖子(共<span class="cardImageText-num">{{cardImageTextTableDataTotal}}</span>篇)
                                </el-form-item>
                                <el-form-item class="select-wrap">
                                    <el-dropdown  @command="handleCommand">
                                        <span class="el-dropdown-link">
                                            {{dropdownSelectText}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="全部">全部</el-dropdown-item>
                                            <el-dropdown-item command="我发布的">我发布的</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-form-item>
                                <el-form-item label="是否置顶">
                                    <el-select v-model="stickValue" placeholder="请选择" @change="stickChange">
                                        <el-option  v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="imageTextCardKeyword" placeholder="请输入关键字搜索" @change.native="initImageTextData"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.native="searchImageTextCard">查询</el-button>
                                    <el-button type="primary" plain @click="handleAddNewTextCard">新建帖子</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="carImageText-tab-wrap">
                                <el-table :data="cardImageTextTableData"  style="width: 100%" border>
                                    <el-table-column prop="manifestoTitle" label="内容">
                                        <template slot-scope="scope">
                                            <div class="img-wrap">
                                                <img :src="getImgUrl(scope.row.videoUrl)" class="image" v-if="scope.row.videoUrl !== ''" />
                                            </div>
                                            {{scope.row.manifestoTitle}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="publishTime" label="更新时间" > </el-table-column>
                                    <el-table-column  prop="handle"  label="操作" >
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="editImageTextCard(scope.row)">查看</el-button>
                                            <el-button type="danger" size="mini" @click="deleteImageTextCard(scope.row.uuid)">删除</el-button>
                                            <el-button type="primary" size="mini" @click="toggleStickPost(scope.row)">{{scope.row.needTop === true ? '取消置顶' : '置顶'}}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="block-pagination">
                                <el-pagination v-if="cardImageTextTableDataTotal !== 0" @size-change="sizeChange" @current-change="currentChange" :current-page="currentPage" :page-sizes="[10,20, 50, 100]" :page-size="pageSize" layout="->,prev, pager, next, jumper, sizes,total" :total="cardImageTextTableDataTotal">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="视频帖子" name="second" class="card-tab-video">
                            <el-form :inline="true" class="cardImageText-form">
                                <el-form-item class="cardImageText-total-num">
                                    视频帖子(共<span class="cardImageText-num">{{cardVideoTableDataTotal}}</span>篇)
                                </el-form-item>
                                <el-form-item class="select-wrap">
                                    <el-dropdown  @command="handleCommand">
                                        <span class="el-dropdown-link">
                                            {{dropdownSelectText}}<i class="el-icon-arrow-down el-icon--right"></i>
                                        </span>
                                        <el-dropdown-menu slot="dropdown">
                                            <el-dropdown-item command="全部">全部</el-dropdown-item>
                                            <el-dropdown-item command="我发布的">我发布的</el-dropdown-item>
                                        </el-dropdown-menu>
                                    </el-dropdown>
                                </el-form-item>
                                <el-form-item label="是否置顶">
                                    <el-select v-model="stickValue" placeholder="请选择" @change="stickChange">
                                        <el-option  v-for="(item, index) in options" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item>
                                    <el-input v-model="VideoCardKeyword" placeholder="请输入关键字搜索" @change.native="initVideoData"></el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" @click.native="searchVideoCard">查询</el-button>
                                    <el-button type="primary" plain @click="handleAddNewVideoCard">新建帖子</el-button>
                                </el-form-item>
                            </el-form>
                            <div class="carImageText-tab-wrap">
                                <el-table :data="cardVideoTableData"  style="width: 100%" border>
                                    <el-table-column prop="manifestoTitle" label="内容">
                                        <template slot-scope="scope">
                                            <img :src="scope.row.coverUrl" class="image" /> {{scope.row.manifestoTitle}}
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="publishTime" label="视频链接" >
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="checkVideo(scope.row.uuid)">查看</el-button>
                                        </template>
                                    </el-table-column>
                                    <el-table-column prop="publishTime" label="更新时间" > </el-table-column>
                                    <el-table-column  prop="handle"  label="操作" >
                                        <template slot-scope="scope">
                                            <el-button size="mini" @click="editVideoCard(scope.row)">编辑</el-button>
                                            <el-button type="danger" size="mini" @click="deleteVideoCard(scope.row.uuid)">删除</el-button>
                                            <el-button type="primary" size="mini" @click="toggleStickPost(scope.row)">{{scope.row.needTop === true ? '取消置顶' : '置顶'}}</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                            <div class="block-pagination">
                                <el-pagination @size-change="sizeChangeVideoCard" @current-change="currentChangeVideoCard" :current-page="currentPage1" :page-sizes="[10,20, 50, 100]" :page-size="pageSize1" layout="->,prev, pager, next, jumper, sizes,total" :total="cardVideoTableDataTotal">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </el-tab-pane>
                <el-tab-pane label="评论管理" name="second" class="commentManage">
                    <el-row>
                        <el-col :span="6">
                            <div class="grid-content bg-purple-light card-list">
                                <el-table :data="commentCardTableData" style="width: 100%">
                                    <el-table-column prop="data" label="帖子列表">
                                        <template slot-scope="scope">
                                            <div @click="selectCommentList(scope.row.data.uuid)" style="cursor:pointer">
                                                <div class="card-title">{{scope.row.data.manifestoTitle}}</div>
                                                <div class="card-info">
                                                    <span class="time">{{scope.row.data.publishTime}}</span>
                                                    <span class="comment-num">{{scope.row.data.commentNum}}条</span>
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination v-if="commentCardDataTotal !== 0" @current-change="currentChangeCardList" :current-page="currentPageCommentCard" :page-size="pageSizeCommentCard" small layout="->, prev, pager, next, jumper" :total="commentCardDataTotal">
                                </el-pagination>
                            </div>
                        </el-col>
                        <el-col :span="18" class="comment-table-wrap">
                            <div class="grid-content bg-purple-light card-comment">
                                <el-table :data="commentTableData" style="width: 100%">
                                    <el-table-column prop="commentContent" label="评论内容">
                                        <template slot-scope="scope">
                                            <div class="comment-content">
                                                <div class="headImg">
                                                    <!-- <img :src="'http://srs.sf-express.com/filemange/' + scope.row.commentContent.commentNum +'.jpg'" alt=""> -->
                                                    <img :src="scope.row.commentContent.commentNum | commentHeadImgUrl" alt="">
                                                </div>
                                                <div class="comment-info">
                                                    <div class="comment-author">{{scope.row.commentContent.commentName}}</div>
                                                    <div class="comment-num">{{scope.row.commentContent.commentContent}}</div>
                                                    <div class="comment-time">{{scope.row.commentContent.commentTime}}</div>
                                                </div>
                                            </div>
                                        </template>
                                    </el-table-column>
                                    <el-table-column label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger" class="btn-del" @click="deleteCommentList(scope.row.commentContent.uuid)">删除</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <el-pagination v-if="commentDataTotal !== 0" @current-change="currentChangeCommentList" :current-page="currentPageComment" :page-size="pageSizeComment" small layout="->, prev, pager, next, jumper" :total="commentDataTotal">
                                </el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </template>
        <el-dialog :title="dialogNewCardTitle" :visible.sync="dialogNewCardVisible" @closed="handleDialogClosed">
            <el-form class="imageTextCardForm">
                <el-form-item label="帖子标题" :label-width="formLabelWidth">
                    <el-input v-model="newCardDialogData.title" placeholder="请输入帖子标题(限制30字符)" maxlength="30"></el-input>
                </el-form-item>

                <el-form-item label="帖子内容" :label-width="formLabelWidth">
                    <el-input type="textarea" rows="5" v-model="newCardDialogData.postContent" placeholder="请输入帖子内容" resize="none"></el-input>
                </el-form-item>
                
                <el-form-item label="上传图片" :label-width="formLabelWidth">
                    <el-upload
                    class="avatar-uploader"
                    ref="upload"
                    action=""
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="getTextCardImageUrl(imageUrl)" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">{{dialogNewCardTips}}</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogNewCardVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUpload">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="dialogNewVideoCardTitle" :visible.sync="dialogNewVideoCardVisible" @closed="handleDialogClosed">
            <el-form class="imageTextCardForm">
                <el-form-item label="帖子标题" :label-width="formLabelWidth">
                    <el-input v-model="newCardDialogData.title" placeholder="请输入帖子标题(限制30字符)" maxlength="30"></el-input>
                </el-form-item>

                <el-form-item label="帖子内容" :label-width="formLabelWidth">
                    <el-input type="textarea" rows="5" v-model="newCardDialogData.postContent" placeholder="请输入帖子内容" resize="none"></el-input>
                </el-form-item>
                
                <el-form-item label="上传视频" :label-width="formLabelWidth">
                    <!-- <el-input type="textarea" v-model="rejectDialogData.remark"></el-input> -->
                    <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :on-success="handleVideoSuccess"
                    :before-upload="beforeVideoUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">{{dialogNewVideoCardTips}}</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogNewVideoCardVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmUploadVideo">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="播放视频" :visible.sync="dialogVideoWrap" @closed="handleVideoWrapClosed">
            <video class="element-video" autoplay :src="videoSrc" ref="video"></video>
        </el-dialog>
    </div>
</template>

<script>
import Qs from 'qs';
export default {
    data() {
        return {
            options: [
                {
                    value: 'all',
                    label: '全部'
                }, 
                {
                    value: 'stick',
                    label: '置顶'
                }, 
                {
                    value: 'notStick',
                    label: '非置顶'
                }
            ],
            stickValue: 'all',
            dialogVideoWrap: false,
            dialogNewCardTitle: '新建图文帖子',
            dialogNewCardTips: '只能上传jpg/png文件，且不超过2M',
            dialogNewVideoCardTitle: '新建视频帖子',
            dialogNewVideoCardTips: '只能上传mp4文件，且不超过15M,如上传长时间无响应，可利用软件“格式工厂”转化为H.264编码格式',
            videoSrc: '',
            tabIndex: '0',
            activeName: 'first',
            /* 帖子管理 */
            cardTabIndex: '0',
            activeCardName: 'first',
            imageTextCardKeyword: '',
            cardImageTextTableData: [],
            currentPage: 1,
            pageSize: 10,
            cardImageTextTableDataTotal: 0,
            param: null,
            //视频帖子
            editVideoCardUuid: '',
            VideoCardKeyword: '',
            cardVideoTableData: [],
            currentPage1: 1,
            pageSize1: 10,
            cardVideoTableDataTotal: 2,
            dialogNewCardVisible: false,
            dialogNewVideoCardVisible: false,
            formLabelWidth: '120px',
            newCardDialogData: {
                title: '',
                postContent: ''
            },
            imageUrl: '',
            isEditImageTextCard: false,
            editImageTextCardUuid: '',
            deleteImageTextCardUuid: '',

            /* 评论管理 */
            queryCommentInfoId: '',
            commentCardTableData: [],
            commentCardDataTotal: 0,
            currentPageCommentCard: 1,
            pageSizeCommentCard: 10,
            commentTableData: [],
            commentDataTotal: 0,
            currentPageComment: 1,
            pageSizeComment: 10,
            queryPublishMan: '',
            dropdownSelectText: '全部',
            loading: null,
            token: '',
            tokenImg: '',
            signature: '',
            // 视频上传
            uploadVideoUrl: '',
            videoName: '',
            videoId: '',
            queryTopPost: ''
        }
    },
    methods: {
        handleVideoWrapClosed() {
            console.log(this.$refs.video.pause)
            this.$refs.video.pause();
            this.$refs.video.currentTime = 0;
        },
        getImgUrl(url) {
            return this.$store.state.global.url + 'sfimimgload?path=' + url
        },
        getTextCardImageUrl(url) {
            if(this.isEditImageTextCard === true) {
                return this.$store.state.global.url + 'sfimimgload?path=' + url
            } else {
                return url;
            }
        },
        handleAddNewTextCard() {
            console.log(this.isEditImageTextCard);
            this.dialogNewCardTitle = '新建图文帖子';
            this.dialogNewCardTips= '只能上传jpg/png文件，且不超过2M';
            this.dialogNewCardVisible = true;  
        },
        handleAddNewVideoCard() {
            this.dialogNewVideoCardTitle = '新建视频帖子';
            this.dialogNewVideoCardTips = '只能上传mp4文件，且不超过15M,如上传长时间无响应，可利用软件“格式工厂”转化为H.264编码格式';  
            this.dialogNewVideoCardVisible = true;  
        },
        tabClick(tab) {
            var a = ''
            if(tab.index === this.tabIndex) {
                return;
            }
            this.tabIndex = tab.index;
            if(tab.label === '评论管理') {
                this.getCommentData();
            } else {
                this.getImageTextData();
            }
        },
        /* 帖子管理 */
        cardTabClick(tab) {
            if(tab.index === this.cardTabIndex) {
                return;
            }
            this.cardTabIndex = tab.index;
            this.queryPublishMan = '';
            this.dropdownSelectText = '全部';
            if(tab.label === '图文帖子') {
                this.getImageTextData();
            } else { //视频帖子
                this.getVideoCardData();
            }
        },
        // 图文帖子
        handleCommand(command) {
            if(command === '我发布的') {
                console.log(command)
                this.dropdownSelectText = '我发布的';
                this.queryPublishMan = 'yes';
                if(this.cardTabIndex === '0') {
                    this.getImageTextData()
                } else {
                    this.getVideoCardData();
                }
            } else {
                this.dropdownSelectText = '全部'
                this.queryPublishMan = '';
                if(this.cardTabIndex === '0') {
                    this.getImageTextData()
                } else {
                    this.getVideoCardData();
                }
            }
        },
        initImageTextData() {
            if(this.imageTextCardKeyword === '') {
                this.getImageTextData();
            }
        },
        getImageTextData() {
            let that = this;
            this.$axios.post('/workpost/queryPostInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                postType: 0,
                queryPublishMan: this.queryPublishMan,
                likeStr: this.imageTextCardKeyword,
                queryTopPost: this.queryTopPost
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var list = data.result.list;
                    that.cardImageTextTableData = list;
                    that.cardImageTextTableDataTotal = data.result.total;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        searchImageTextCard() {
            if(this.imageTextCardKeyword === '') {
                return;
            }
            this.getImageTextData();
        },
        initImageTextTableData() {
            if(this.searchKeyword === '') {
                this.getImageTextData();
            }
        },
        sizeChange(val) {
            this.pageSize = val;
            this.getImageTextData();
        },
        currentChange(val) {
            this.currentPage = val;
            this.getImageTextData();
        },
        editImageTextCard(item) {
            this.newCardDialogData.title = item.manifestoTitle;
            this.newCardDialogData.postContent = item.postContent;
            this.imageUrl = item.videoUrl;
            this.editImageTextCardUuid = item.uuid;
            this.dialogNewCardVisible = true;
            this.isEditImageTextCard = true;
            this.dialogNewCardTitle = '修改图文帖子';
            this.dialogNewCardTips = '只能修改帖子标题和内容，无法修改图片文件';
        },
        confirmEditImageTextCard() {
            //修改图文帖子
            this.$axios.post('/workpost/updatePost', {
                uuid: this.editImageTextCardUuid,
                updateManifestoTitle: this.newCardDialogData.title,
                postContent: this.newCardDialogData.postContent
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.dialogNewCardVisible = false;
                    this.getImageTextData();
                    this.isEditImageTextCard = false;
                } else if(res.data.succ === 'fail') {
                    this.$message.error('修改失败');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            
        },
        deleteImageTextCard(uuid) {
            this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDeleteImageTextCard(uuid);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        confirmDeleteImageTextCard(uuid) {
            //删除图文帖子
            this.$axios.post('/workpost/deletePost', {
                uuid: uuid
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getImageTextData();
                } else {
                    this.$message.error('删除失败');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //新增图文帖子
        handleAvatarSuccess(res, file) {
            this.imageUrl = URL.createObjectURL(file.raw);
            console.log(file)
        },
        confirmUpload() {
            if(this.isEditImageTextCard) {
                this.confirmEditImageTextCard();
                return;
            }

            //新增图文帖子
            if(this.newCardDialogData.title === '') {
                this.$message({
                    showClose: true,
                    message: '请输入帖子标题',
                    type: 'warning'
                });
                return;
            } else if(this.newCardDialogData.postContent === '') {
                this.$message({
                    showClose: true,
                    message: '请输入帖子内容',
                    type: 'warning'
                });
                return;
            } 

            if(this.param === null) {
                //没有上传图片
                this.$axios.post('/workpost/publishPost', {
                    manifestoTitle: this.newCardDialogData.title,
                    postContent: this.newCardDialogData.postContent,
                    postType: 0,
                })
                .then((res) => {
                    var data = res.data;
                    if(data.succ === 'ok') {
                        this.$message({
                            message: '创建帖子成功',
                            type: 'success'
                        });
                        this.dialogNewCardVisible = false;
                        this.getImageTextData()
                        this.imageUrl = '';
                        this.newCardDialogData.title = '';
                        this.newCardDialogData.postContent = '';
                    } else {
                        this.$message.error('新建帖子失败')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            } else {
                //上传图片
                this.$axios.post('/workpost/publishPost', {
                    manifestoTitle: this.newCardDialogData.title,
                    postContent: this.newCardDialogData.postContent,
                    postType: 0,
                    uuid: this.tokenImg
                })
                .then((res) => {
                    var data = res.data;
                    if(data.succ === 'ok') {
                        this.$message({
                            message: '创建帖子成功',
                            type: 'success'
                        });
                        this.dialogNewCardVisible = false;
                        this.getImageTextData()
                        this.imageUrl = '';
                        this.newCardDialogData.title = '';
                        this.newCardDialogData.postContent = '';
                    } else {
                        this.$message.error('新建帖子失败')
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
            }
        },
        beforeAvatarUpload(file) {
            let that = this;
            if(this.isEditImageTextCard) {
                return; 
            }
            const isJPG = (file.type === 'image/png' || file.type === 'image/jpg' || file.type === 'image/jpeg');
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
                this.$message.error('上传图片只能是 jpg/jpeg/png格式!');
                return false;
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
                return false;
            }

            this.param = new FormData();
            this.param.append('file', file, file.name);
            let config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            this.$axios.post('/workpost/uploadPostFile', this.param, config)
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var windowURL = window.URL;
                    this.imageUrl = windowURL.createObjectURL(file);
                    that.tokenImg = data.msg;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },

        //视频帖子
        //新增视频帖子
        confirmUploadVideo() {
            if(this.isEditVideoCard) {
                this.confirmEditVideoCard();
            }

            //新增视频帖子
            if(this.newCardDialogData.title === '') {
                this.$message({
                    showClose: true,
                    message: '请输入帖子标题',
                    type: 'warning'
                });
                return;
            } else if(this.newCardDialogData.postContent === '') {
                this.$message({
                    showClose: true,
                    message: '请输入帖子内容',
                    type: 'warning'
                });
                return;
            } else if(this.imageUrl === '') {
                this.$message({
                    showClose: true,
                    message: '请先上传视频',
                    type: 'warning'
                });
                return;
            }



            this.$axios.post('/workpost/publishPost', {
                manifestoTitle: this.newCardDialogData.title,
                postContent: this.newCardDialogData.postContent,
                postType: 1,
                videoUrl: this.uploadVideoUrl,
                videoId: this.videoId,
                coverUrl: this.imageUrl
            })
            .then((res) => {
                this.param = null;
                var data = res.data;
                if(data.succ === 'ok') {
                    this.$message({
                        message: '创建帖子成功',
                        type: 'success'
                    });
                    this.dialogNewVideoCardVisible = false;
                    if(this.cardTabIndex === '0') {
                        this.getImageTextData()
                    } else {
                        this.getVideoCardData();
                    }
                    this.imageUrl = '';
                    this.newCardDialogData.title = '';
                    this.newCardDialogData.postContent = '';
                } else {
                    this.$message.error('新建帖子失败')
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        beforeVideoUpload(file) {
            this.loading = this.$loading({
                lock: true,
                text: 'Loading',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.1)'
            });
            let that = this;
            const isVideo = (file.type === 'video/mp4');
            const isLt15M = file.size / 1024 / 1024 < 15;

            if (!isVideo) {
                this.$message.error('上传视频只能是 mp4 格式!');
                this.loading.close();
                return false;
            }
            if (!isLt15M) {
                this.$message.error('上传视频大小不能超过 15MB!');
                this.loading.close();
                return false;
            }
            var windowURL = window.URL;
            var videoFilePath = windowURL.createObjectURL(file)
            that.getVideoImage(videoFilePath, file);
        },
        uploadVideoFile(file, coverUrl) {
            let that = this;
            var getSignature = function(callback){
                that.$axios.post('match/generateSign', {})
                .then((res) => {
                    var data = res.data;
                    if(data.succ === 'ok') {
                        callback(data.msg)
                        that.signature = data.msg;
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            };
            qcVideo.ugcUploader.start({
                videoFile: file,//视频，类型为 File
                coverFile: coverUrl,
                getSignature: getSignature,//前文中所述的获取上传签名的函数
                error: function(result){//上传失败时的回调函数
                    console.log('上传失败的原因：' + result.msg);
                },
                finish: function(result){//上传成功时的回调函数
                    console.log(result);
                    that.videoId = result.fileId;
                    that.videoName = result.videoName;
                    that.uploadVideoUrl = result.videoUrl;
                    that.imageUrl = result.coverUrl;
                    that.loading.close();
                }
            });
        },
        getVideoImage(videoFilePath, file) {
            let that = this;
            const video = document.createElement('video');
            video.src = videoFilePath;
            video.volume = 0;
            video.play();
            video.addEventListener('timeupdate', loadedmetadata , false)
            console.log(videoFilePath)
            function loadedmetadata() {
                if(video.currentTime >= 1) {
                    const canvas = document.createElement('canvas');
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    const ctx = canvas.getContext('2d');
                    console.log(canvas.width, canvas.height)
                    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

                    const image = new Image();
                    image.src = canvas.toDataURL('image/png');
                    image.onload = function() {
                        var coverUrl = dataURLtoFile(image.src, 'coverImg.jpeg')
                        that.uploadVideoFile(file, coverUrl)
                    }
                    video.removeEventListener('timeupdate', loadedmetadata);          
                }
            }
            function dataURLtoFile(dataurl, filename) {
                var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
                    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
                while(n--){
                    u8arr[n] = bstr.charCodeAt(n);
                }
                return new File([u8arr], filename, {type:mime});
            }
        },
        handleVideoSuccess() {

        },
        getVideoCardData() {
            let that = this;
            this.$axios.post('/workpost/queryPostInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                postType: 1,
                queryPublishMan: this.queryPublishMan,
                likeStr: this.VideoCardKeyword,
                queryTopPost: this.queryTopPost
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    var data = res.data;
                    var list = data.result.list;
                    that.cardVideoTableData = list;
                    that.cardVideoTableDataTotal = data.result.total;
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        editVideoCard(item) {
            this.newCardDialogData.title = item.manifestoTitle;
            this.newCardDialogData.postContent = item.postContent;
            this.imageUrl = item.coverUrl;
            this.editVideoCardUuid = item.uuid;
            this.dialogNewVideoCardVisible = true;
            this.isEditVideoCard = true;
            this.dialogNewVideoCardTitle = '修改视频帖子';
            this.dialogNewVideoCardTips = '只能修改帖子标题和内容，无法修改视频文件';
        },
        confirmEditVideoCard() {
            //修改视频帖子
            this.$axios.post('/workpost/updatePost', {
                uuid: this.editVideoCardUuid,
                updateManifestoTitle: this.newCardDialogData.title,
                postContent: this.newCardDialogData.postContent
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.dialogNewVideoCardVisible = false;
                    this.getVideoCardData();
                    this.isEditVideoCard = false;
                } else {
                    this.$message.error('修改失败');
                }
            })
            .catch((err) => {
                console.log(err);
            })
            
        },
        deleteVideoCard(uuid) {
            this.$confirm('此操作将永久删除该帖子, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmDeleteVideoCard(uuid);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        confirmDeleteVideoCard(uuid) {
            //删除视频帖子
            this.$axios.post('/workpost/deletePost', {
                uuid: uuid
            })
            .then((res) => {
                if(res.data.succ === 'ok') {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.getVideoCardData();
                } else {
                    this.$message.error('删除失败');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        searchVideoCard() {
            if(this.VideoCardKeyword === '') {
                return;
            }
            this.getVideoCardData();
        },
        initVideoData() {
            if(this.VideoCardKeyword === '') {
                this.getVideoCardData();
            }
        },
        currentChangeVideoCard(val) {
            this.currentPage1 = val;
            this.getVideoCardData();
        },
        sizeChangeVideoCard(val) {
            this.pageSize1 = val;
            this.getVideoCardData();
        },

        //置顶
        stickChange(val) {
            if(val === 'all') {
                //显示全部
                this.queryTopPost = '';
                if(this.cardTabIndex === '0') {
                    this.getImageTextData();
                } else {
                    this.getVideoCardData();
                }
            } else if(val === 'stick') {
                //显示置顶
                this.queryTopPost = 'yes';
                if(this.cardTabIndex === '0') {
                    this.getImageTextData();
                } else {
                    this.getVideoCardData();
                }
            } else if(val === 'notStick') {
                this.queryTopPost = 'no';
                if(this.cardTabIndex === '0') {
                    this.getImageTextData();
                } else {
                    this.getVideoCardData();
                }
            }
        },
        toggleStickPost(item) {
            if(item.needTop) {
                this.cancelPostStick(item.uuid)
            } else {
                this.postStick(item.uuid)
            }
        },
        // 帖子置顶
        postStick(uuid) {
            this.$axios.post('/workpost/postTop', {
                uuid: uuid
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    this.$message({
                        message: '置顶成功',
                        type: 'success'
                    });
                    if(this.cardTabIndex === '0') {
                        this.getImageTextData();
                    } else {
                        this.getVideoCardData();
                    }
                } else {
                    this.$message({
                        message: '置顶失败',
                        type: 'success'
                    });
                }
            })
        },
        // 取消帖子置顶
        cancelPostStick(uuid) {
            let that = this;
            this.$axios.post('/workpost/cancelPostTop', {
                uuid: uuid
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    this.$message({
                        message: '取消置顶成功',
                        type: 'success'
                    });
                    console.log(that.cardTabIndex)
                    if(that.cardTabIndex === '0') {
                        that.getImageTextData();
                    } else {
                        that.getVideoCardData();
                    }
                } else {
                    this.$message({
                        message: '取消置顶失败',
                        type: 'success'
                    });
                }
            })
        },

        /* 评论管理 */
        getCommentData() {
            let that = this;
            this.$axios.post('/workpost/queryPostCommentInfo', {
                currentPage: this.currentPageCommentCard,
                pageSize: this.pageSizeCommentCard
            })
            .then((res) => {
                var data = res.data;
                
                var list = data.result.list;
                var commentCardTableData = []
                if(list.length !== 0) {
                    list.forEach((item, index) => {
                        var dataWrap = {
                            data: {}
                        };
                        dataWrap.data = item
                        commentCardTableData.push(dataWrap)
                    })
                    that.commentCardTableData = commentCardTableData;
                    that.commentCardDataTotal = data.result.total;
                    that.selectCommentList(that.commentCardTableData[0].data.uuid)
                } else {
                    that.commentCardTableData = [];
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        currentChangeCardList(val) {
            this.currentPageCommentCard = val;
            this.getCommentData();
        },
        selectCommentList(uuid) {
            if(uuid !== undefined) {
                this.queryCommentInfoId = uuid;
            }
            let that = this;
            this.$axios.post('/workpost/queryCommentInfo', {
                uuid: this.queryCommentInfoId,
                currentPage: this.currentPageComment,
                pageSize: this.pageSizeComment
            })
            .then((res) => {
                var data = res.data;
                var list = data.result.list;
                console.log(list)
                var commentTableData = [];
                if(list.length !== 0) {
                    list.forEach((item, index) =>　{
                        var commentContentWrap = {
                            commentContent: {}
                        };
                        commentContentWrap.commentContent = item;
                        commentTableData.push(commentContentWrap);
                    })
                }
                that.commentTableData = commentTableData;
                that.commentDataTotal = data.result.total;
                console.log(that.commentTableData)
            })
            .catch((err) => {
                console.log(err);
            })
        },
        currentChangeCommentList(val) {
            this.currentPageComment = val;
            this.selectCommentList();
        },
        deleteCommentList(uuid) {
            this.$confirm('是否要删除该条评论？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.confirmdeleteCommentList(uuid);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        confirmdeleteCommentList(uuid) {
            //删除评论列表
            let that = this;
            this.$axios.post('/workpost/deletePostComment', {
                uuid: uuid
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    this.$message({
                        message: '删除评论成功',
                        type: 'success'
                    });
                    this.selectCommentList(that.queryCommentInfoId);
                } else {
                    this.$message.error('删除评论失败');
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        getUserArea() {
            this.$axios.post('/workpost/getUserArea', {})
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var area = data.result.area;
                    var subArea = data.result.subArea;
                    this.$store.commit('setArea', area);
                    this.$store.commit('setSubArea', subArea);
                }
            })
            .catch((err) => {
                console.log(err);
            })
        },
        handleDialogClosed() {
            this.imageUrl = '';
            this.newCardDialogData.title = '';
            this.newCardDialogData.postContent = '';
            this.param = null;
            if(this.isEditImageTextCard === true) {
                this.isEditImageTextCard = false;
            }
            if(this.isEditVideoCard === true) {
                this.isEditVideoCard = false;
            }
        },
        checkVideo(uuid) {
            this.$axios.post('/workpost/getVideoUrl', {
                uuid: uuid
            })
            .then((res) => {
                var videoUrl = res.data.msg;
                this.videoSrc = videoUrl;
                this.dialogVideoWrap = true;
            })
        }
    },
    filters: {
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        }
    },
    mounted() {
        this.getImageTextData();
        this.getUserArea();
    }
}
</script>

<style lang="less">
.card-tab .el-tabs__nav{
    float: none;
    text-align: center;
}
</style>

<style lang="less">
.img-wrap {
    width: 200px;
    height: 100px;
    position: relative;
    display: inline-block;
    overflow: hidden;
    vertical-align: middle;
    margin-right: 10px;
    img{
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}
.cardImageText-total-num .el-form-item__content{
    font-size: 16px;
    
}
.select-wrap{
    margin-left: 20px;
    width: 45%;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}
.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
.image{
    width: 120px;
    height: auto;
    vertical-align: middle;
    margin-right: 20px;
}

// 评论管理
.commentManage{
    thead{
        .cell{
            text-align: center;
        }
    }
}
.card-list,
.card-comment{
    height: 100%;
    border: 1px solid #ebeef5;
    padding-bottom: 20px;
}
.card-info{
    font-size: 12px;
    color: #a9a9a9;
    .comment-num{
        margin-top: 6px;
        float: right;
    }
}
.comment-table-wrap{
    box-sizing: border-box;
    padding-left: 50px;
    .btn-del{
        display: block;
        margin: 0 auto;
    }
}
.comment-content{
    display: flex;
    font-size: 14px;
    .headImg{
        flex: 80px 0 0;
        img{
            width: 60px;
            height: 60px;
            border-radius: 50%;
            vertical-align: middle
        }
    }
    .comment-author,
    .comment-time{
        color: #9a9a9a;
    }
}
.element-video{
    display: block;
    width: 100%;
}
</style>

