<template>
    <div class="official-video">
        <el-form :inline="true" class="official-video-form">
            <el-form-item>
                <el-button type="primary" plain @click="handleAddOfficialVideo">新建官方宣传栏</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrap" v-if="videoData.length !== 0">
            <el-table :data="videoData"  style="width: 100%" border>
                <el-table-column prop="createManName" label="发布人">
                </el-table-column>
                <el-table-column prop="publishTime" label="视频链接" >
                    <template slot-scope="scope">
                        <el-button size="mini" @click="checkVideo(scope.row.uuid)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="publishTime" label="更新时间" ></el-table-column>
                <el-table-column  prop="handle"  label="操作" >
                    <template slot-scope="scope">
                        <el-button type="primary" size="mini" @click="editOfficialVideo(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <h2 class="comment-title">官方宣传栏评论</h2>
        <el-form :inline="true">
            <el-form-item>
                    <el-input v-model="searchKeyword" placeholder="请输入评论关键字搜索" @change.native="initData"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click.native="search">查询</el-button>
            </el-form-item>
        </el-form>
        <div class="comment-tableWrap">
            <el-table :data="commentTableData" style="width: 100%" border>
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
            <el-pagination v-if="commentDataTotal !== 0" @current-change="currentChangeCommentList"  @size-change="sizeChange" :current-page="currentPage" :page-sizes="[10,20, 50, 100]" small layout="->,prev, pager, next, jumper, sizes,total" :total="commentDataTotal">
            </el-pagination>
        </div>
        <el-dialog title="新建官方宣传栏" :visible.sync="dialogOfficialVideoVisible" @closed="handleDialogClosed">
            <el-form class="imageTextCardForm">
                <el-form-item label="宣传标题" :label-width="formLabelWidth">
                    <el-input  v-model="newOfficialVideo.title" placeholder="请输入帖子标题(限制30字符)" maxlength="30"></el-input>
                </el-form-item>
                
                <el-form-item label="上传视频" :label-width="formLabelWidth">
                    <el-upload
                    class="avatar-uploader"
                    action=""
                    :show-file-list="false"
                    :on-success="handleVideoSuccess"
                    :before-upload="beforeVideoUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else  class="el-icon-plus avatar-uploader-icon"></i>
                        <div slot="tip" class="el-upload__tip">{{dialoguploadVideoTips}}</div>
                    </el-upload>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOfficialVideoVisible = false">取 消</el-button>
                <el-button type="primary" @click="confirmAddOfficialVideo">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="播放视频" :visible.sync="dialogVideoWrap" @closed="handleVideoWrapClosed">
            <video class="element-video" autoplay :src="videoSrc" ref="video"></video>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return {
            dialogOfficialVideoVisible: false,
            formLabelWidth: '120px',
            newOfficialVideo: {
                title: '',
            },
            imageUrl: '',
            dialoguploadVideoTips: '只能上传mp4文件，且不超过15M,如上传长时间无响应，可利用软件“格式工厂”转化为H.264编码格式',
            videoUrl: '',
            videoId: '',
            coverUrl: '',
            videoData: [],
            dialogVideoWrap: false,
            videoSrc: '',
            canEditTitle: true,
            canPublishVideo: true,
            commentTableData: [],
            commentDataTotal: 0,
            currentPage: 1,
            pageSize: 10,
            searchKeyword: ''
        }
    },
    mounted() {
        this.getData();
        this.getOfficialVideoComment();
    },
    methods: {
        initData() {
            if(this.searchKeyword === '') {
                this.getOfficialVideoComment();
            }
        },
        search() {
            if(this.searchKeyword === '') {
                return;
            }
            this.getOfficialVideoComment();
        },
        handleAddOfficialVideo() {
            if(!this.canPublishVideo) {
                this.$message.error('官方视频只能存在一条数据！');
                return;
            }
            this.dialogOfficialVideoVisible = true;
        },
        handleDialogClosed() {
            this.videoUrl = '';
            this.videoId = '';
            this.coverUrl = '';
            this.imageUrl = '';
            this.newOfficialVideo.title = '';
        },
        handleVideoWrapClosed() {
            this.$refs.video.pause();
            this.$refs.video.currentTime = 0;
        },
        getData() {
            let that = this;
            this.$axios.post('workmatch/selectAdminVideo')
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    if(data.result === null) {
                        return;
                    }
                    that.videoData = [];
                    that.videoData.push(data.result);
                    that.canPublishVideo = false
                }
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
                this.$message.error('上传图片只能是 mp4 格式!');
                this.loading.close();
                return false;
            }
            if (!isLt15M) {
                this.$message.error('上传图片大小不能超过 15MB!');
                this.loading.close();
                return false;
            }
            var windowURL = window.URL;
            var videoFilePath = windowURL.createObjectURL(file)
            that.getVideoImage(videoFilePath, file);
        },
        uploadVideoFile(file, coverUrl) {
            console.log(file,coverUrl)
            let that = this;
            var getSignature = function(callback){
                that.$axios.post('match/generateSign', {})
                .then((res) => {
                    var data = res.data;
                    if(data.succ === 'ok') {
                        callback(data.msg)
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
                    that.videoUrl = result.videoUrl;
                    that.imageUrl = result.coverUrl;
                    that.loading.close();
                },
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
                        var coverUrl = dataURLtoFile(image.src, 'coverImg.jpeg');
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
        confirmAddOfficialVideo() {
            if(this.canEditTitle === false) {
                this.handleEditOfficialVideo();
                return;
            }
            let that = this;
            if(this.newOfficialVideo.title === '') {
                this.$message({
                    showClose: true,
                    message: '请输入标题',
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
            this.$axios.post('workmatch/publishAdminVideo', {
                videoUrl: this.videoUrl,
                videoId: this.videoId,
                coverUrl: this.imageUrl,
                manifestoTitle: this.newOfficialVideo.title
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    that.$message({
                        message: '新建官方宣传栏成功',
                        type: 'success'
                    });
                    that.dialogOfficialVideoVisible = false;
                    that.getData();
                } else {
                    that.$message.error(data.msg)
                }
            })
        },
        editOfficialVideo() {
            this.newOfficialVideo.title = this.videoData[0].manifestoTitle;
            this.canEditTitle = false;
            this.dialogOfficialVideoVisible = true;
        },
        handleEditOfficialVideo() {
            let that = this;
            this.$axios.post('/workmatch/replaceAdminVideo', {
                uuid: this.videoData[0].uuid,
                videoUrl: this.videoUrl,
                videoId: this.videoId,
                coverUrl: this.imageUrl,
                manifestoTitle: this.newOfficialVideo.title
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    that.$message({
                        message: '视频替换成功',
                        type: 'success'
                    });
                    that.dialogOfficialVideoVisible = false;
                    that.getData();
                    that.getOfficialVideoComment();
                } else {
                    that.$message.error(data.msg);
                }
            })
            .catch((err) => {
                that.$message.error('视频替换失败');
            })
        },
        handleVideoSuccess() {

        },
        checkVideo(uuid) {
            let that = this;
            this.$axios.post('/workmatch/getVideoUrl', {
                uuid: uuid
            })
            .then((res) => {
                var videoUrl = res.data.msg;
                this.videoSrc = videoUrl;
                this.dialogVideoWrap = true;
            })
            .catch((err) => {
                that.$message.error('获取视频播放地址失败');
            })
        },
        getOfficialVideoComment() {
            let that = this;
            this.$axios.post('/workmatch/queryMatchCommentInfo', {
                currentPage: this.currentPage,
                pageSize: this.pageSize,
                likeStr: this.searchKeyword
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    var list = data.result.list;
                    var commentTableData = [];
                    if(list.length !== 0) {
                        list.forEach((item, index) => {
                            var commentContentWrap = {
                            commentContent: {}
                        };
                        commentContentWrap.commentContent = item;
                        commentTableData.push(commentContentWrap);
                        })
                        that.commentTableData = commentTableData;
                        that.commentDataTotal = data.result.total;
                    } else {
                        that.commentTableData = [];
                    }
                }
            })
            .catch((err) => {
                that.commentTableData = [];
            })
        },
        deleteCommentList(uuid) {
            let that = this;
            this.$axios.post('/workmatch/deleteMatchComment', {
                uuid: uuid
            })
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    that.$message({
                        message: '评论删除成功',
                        type: 'success'
                    });
                    that.getOfficialVideoComment();
                } else {
                    that.$message.error('评论删除失败');
                }
            })
            .catch((err) => {
                that.$message.error('评论删除失败');
            })
        },
        sizeChange(val) {
            this.pageSize = val;
            this.getOfficialVideoComment();
        },
        currentChangeCommentList(val) {
            this.currentPage = val;
            this.getOfficialVideoComment();
        }
    },
    filters: {
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        }
    },
}
</script>

<style lang="less">
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
.comment-title{
    font-weight: 400;
    color: #1f2f3d;
    font-size: 22px;
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
</style>
