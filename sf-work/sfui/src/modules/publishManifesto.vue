<template>
    <div class="publish-manifesto" ref="refPublishManifesto">
        <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">发表脸谱宣言</v-navbar> -->
        <div class="input-box">
            <input type="text" name='title' v-model="manifestoTitle" placeholder="请输入您的脸谱宣言（限制26个字数）" maxlength="26">
        </div>
        
        <div class="upload">
            <input type="file">
            <div class="plus" @click="selectVideo">
               <img src="../assets/images/video.png" ref="uploadImg">
               <span>上传视频</span>
            </div>

            <!-- <input type="file" class="upload-cover" id="upload-cover" ref="uploadCover" accept="image/png, image/jpg, image/jpeg" v-if="isShowUploadCover"> -->
            <!-- <div class="upload-cover-wrap" v-if="isShowUploadCover" @click="selectCoverUrl">
               <img src="../assets/images/pic.png" ref="uploadCoverImg">
               <span>上传视频封面</span>
            </div> -->
            
        </div>
        <div class="btn-publish" @click="publishManifesto()">发布</div>
        <div id="loading" style="display:none">
            <div>
                <img src="../assets/images/successed.png">
                <p>帖子正在发布中，请稍等</p>
            </div>
        </div>
        <div id="loading" style="display:none">
            <div>
                <img src="../assets/images/loading.png">
                <p>帖子正在发布中，请稍等</p>
            </div>
        </div>
        <div class="tips">*&nbsp;&nbsp;视频要求15秒左右<br/>&nbsp;&nbsp;&nbsp;展现员工价值观，工作技能，形象素质，公益行为<br/>&nbsp;&nbsp;&nbsp;演绎顺丰脸谱，SF is U</div>
        <video style="visibility:hidden;" src="" playsinline  webkit-playsinline ref="videoEle"></video>
        <loading v-show="isShowLoading"></loading>
    </div>
</template>


<script>
window.a = ''
</script>

<script>
export default {
    data() {
        return {
            manifestoTitle:"",
            videoUrl: "",
            coverUrl: '',
            videoId: '',
            signature: '',
            isShowLoading: false,
            uploadCoverUrl: '',
            isShowUploadCover: ''
        }
    },
    methods:{
        publishManifesto:function(){
            if(this.manifestoTitle === '') {
                this.$toast.show({
                    text: '请输入您的脸谱宣言',
                    type: 'text'
                });
                return;
            }
            if(this.videoId === '') {
                this.$toast.show({
                    text: '请选择视频',
                    type: 'text'
                });
                return;
            }
            var that = this;
            this.isShowLoading = true;
            this.$axios.post('match/publishManifesto', {  
                "manifestoTitle":that.manifestoTitle,
                "videoUrl": this.videoUrl,
                "coverUrl": this.coverUrl,
                "videoId": this.videoId
            })
            .then(function (response) {
                that.isShowLoading = false;
                var data = response.data;
                if(data.succ === 'ok') {
                    that.isShowLoading = false;
                    that.$Modal.alert.show({
                        title: '上传成功',
                        content: '请留意您的宣言审核状态',
                        onHide() {
                            that.$router.push('/match/matchHot');
                        }
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });

        },
        selectVideo() {
            let that = this;
    //         let ua = navigator.userAgent.toLowerCase();
    //         //android终端
    //         let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
    // 　　    //ios终端
    //         let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
    //         if(!isiOS) {
    //             if(that.uploadCoverUrl === '') {
    //                 that.$toast.show({
    //                     text: '请先上传视频封面图片',
    //                     type: 'text'
    //                 });
    //                 return;
    //             }
    //         }

            ExpressPlugin.getVideoFilePath(selectVideoSuccess, selectVideoFailed);

            function selectVideoSuccess(filePath) {               
                // if(isiOS) {
                //     that.handleUpload(filePath);
                // } else {
                //     that.handleUpload(filePath, that.$refs.uploadCoverImg.src);
                // }
                that.handleUpload(filePath);
            } 

            function selectVideoFailed(errorMsg) {
                console.log(errorMsg);
            }
        },
        // getVideoImage(videoFilePath) {
        //     let that = this;
        //     that.isShowLoading = true;
        //     var video = that.$refs.videoEle;
        //     video.src = videoFilePath;
        //     video.play();
        //     video.addEventListener('timeupdate', loadedmetadata , false)
        //     function loadedmetadata() {
        //         if(video.currentTime >= 1) {
        //             const canvas = document.createElement('canvas');
        //             canvas.width = video.videoWidth;
        //             canvas.height = video.videoHeight;
        //             const ctx = canvas.getContext('2d');
        //             ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        //             const image = new Image();
            
        //             canvas.toBlob(function(blob) {
        //                 image.src = URL.createObjectURL(blob);
        //                 that.coverUrl = URL.createObjectURL(blob);
        //                 var isLoad = false;
        //                 image.onload = function() {
        //                     if(isLoad) {
        //                         return;
        //                     }
        //                     isLoad = true;
        //                     that.$refs.uploadImg.src = image.src;
        //                     that.handleUpload(videoFilePath, image.src);
        //                     // alert(image.src, that.coverUrl)    
        //                 }
        //             }, "image/png");   

        //             // var base64 = canvas.toDataURL()
        //             // image.src = base64;
        //             // var isLoad = false;
        //             // image.onload = function() {
        //             //     if(isLoad) {
        //             //         return;
        //             //     }
        //             //     isLoad = true;
        //             //     that.$refs.uploadImg.src = image.src;
        //             //     that.handleUpload(videoFilePath, image.src);
        //             //     alert(image.src)
        //             // }
        //             video.removeEventListener('timeupdate', loadedmetadata);     
        //         }
        //     }
        // },
        selectCoverUrl() {
            let that = this;
            var cameraOptions = {
                sourceType: window.Camera.PictureSourceType.PHOTOLIBRARY,
                saveToPhotoAlbum: true,
                destinationType: window.Camera.DestinationType.FILE_URI
            }
            navigator.camera.getPicture(successCallback, errorCallback, cameraOptions);

            function successCallback(result) {
                const src = result.original
                // const src = result.original.replace(/file:\/\//i, '') 
                that.$refs.uploadCoverImg.src = src;
                that.uploadCoverUrl = src;
            }

            function errorCallback(error) {
                console.log(error)
            }
        },
        handleUpload(videoPath) {
            let that = this;
            // alert('视频地址:' + videoPath+ '封面地址:' + coverUrl)
            that.isShowLoading = true;
            this.$axios.post('match/generateSign', {})
            .then((res) => {
                var data = res.data;
                if(data.succ === 'ok') {
                    that.signature = data.msg;
                    // if(coverUrlTX !== undefined) {
                    //     ExpressPlugin.startTXVideoUpload(videoPath, that.signature, that.$refs.uploadCoverImg.src);
                    // } else {
                    //     ExpressPlugin.startTXVideoUpload(videoPath, that.signature, '');
                    // }
                    ExpressPlugin.startTXVideoUpload(videoPath, that.signature, '');
                }
            })
            .catch((err) => {
                console.log(err)
            })
            window.onPublishProgress = function(uploadBytes, totalBytes) {
                console.log(uploadBytes, totalBytes)
            }
            window.onPublishComplete = function(result) {
                var resultJson =  JSON.parse(result); 
                var retCode = resultJson.retCode;
                var descMsg   = resultJson.descMsg;
                var videoId = resultJson.videoId;
                var videoURL = resultJson.videoURL;
                var coverURL = resultJson.coverURL;
                that.videoUrl = videoURL;
                that.coverUrl = coverURL;
                that.videoId = videoId;
                
                if(resultJson.retCode == 0) {
                    that.isShowLoading = false;
                    if(that.uploadCoverUrl === '') {
                        that.$refs.uploadImg.src = that.coverUrl;
                    }
                    that.$toast.show({
                        text: '视频上传成功',
                        type: 'text'
                    });
                } else {
                    that.handleUpload(videoPath);
                }
                // alert(result)
            }
        },
        getAppVersion() {
            let that = this;
            let ua = navigator.userAgent.toLowerCase();

    　　    //ios终端
            let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i);
            if(!isiOS) {
                ExpressPlugin.getPhoneInfo(success,fail);
            }
            function success(jsonStr){
                console.log(jsonStr)
                var data = jsonStr ? JSON.parse(jsonStr) : undefined;
                var versionCode = data.versionName.split('.')
                if(versionCode[0] <= 4 && versionCode[1] <= 3) {
                    that.$Modal.alert.show({
                        title: '升级提示',
                        content: '当前丰声版本过低，无法正常使用视频上传功能，建议升级到最新版本'
                    })
                }
            }
            function fail(error){
                console.log(error);
            }
        }
    },
    mounted() {
        this.getAppVersion();
        let that = this;
        this.$setNavTitle('发表脸谱宣言');
        let ua = navigator.userAgent.toLowerCase();
        //android终端
        let isAndroid = ua.indexOf('Android') > -1 || ua.indexOf('Adr') > -1;  
　　    //ios终端
        let isiOS = !!ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/i); 
        
        if(isiOS) {
            this.isShowUploadCover = false;
        } else {
            this.isShowUploadCover = true;
            
        }
    }

}
</script>

<style lang='less' scoped>
.tips{
    position: absolute;
    top: 220px;
    width: 100%;
    // text-align: center;
    color: #5a5a5a;
    font-size: 12px;
}
.input-box{
    width: 100%;

    height: 50px;
    margin-top:10px;
    input{
        height: 50px;
        width: 100%;
        padding-left: 10px;
        color: #212121;;
        border-bottom: 1px solid #f4f4f4;
        font-size: 14px;
    }
}

.upload{
    background: white;
    padding: 30px 10px;
    position: relative;
    input{
        opacity: 0;
        position: absolute;
        z-index: 22;
        width: 80px;
        height: 80px;
        visibility: hidden;
    }
    .plus{
        
        width: 80px;
        height: 80px;
        text-align: center;
        img{
            width: 100%;
            height: 100%;
            
        }
        span{
            color: #ccc;
        }
        
    }
    .upload-cover{
        top: 30px;
        left: 120px;
        visibility: visible;
        opacity: 0;
    }
    .upload-cover-wrap{
        position: absolute;
        width: 80px;
        height: 80px;
        left: 120px;
        top: 30px;
        text-align: center;
        img{
            width: 100%;
            height: 100%;
        }
        span{
            color: #ccc;
        }
    }
}
.btn-publish{
    position: absolute;
    right: 15px;
    top: 172px;
    font-size: 14px;
    color: white;
    background: #f3772e;
    
    padding: 4px 12px;
}
#loading {

	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(0, 0, 0, 0.4);
    z-index: 15000;
    div {
        background: white;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 250px;
        height: 150px;
        margin-top: -100px;
        margin-left: -125px;
        border-radius: 10px;
        text-align: center;
        img{
            margin-top: 20px;
            vertical-align: middle;
            height: 50px;
            width: 50px;
        
       

        }
        p{
            margin-top: 20px;
            text-align: center;
        }
    }
}

 
</style>
