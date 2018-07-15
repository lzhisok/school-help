<template>
    <div>
        <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">发表帖子</v-navbar> -->
        <form>
            <div class="input-box">
            <input type="text" name='manifestoTitle' id="title" placeholder="请输入帖子标题（限制26个字数）" maxlength="26">
            <textarea class="content" placeholder="这一刻想说些什么...(Say something...限制1000字符)" id="content" maxlength="1000" v-model="cardContent"></textarea>
        </div>
        
        <div class="upload" id="uploadPic">
            <input  name="file" id="saveImage" @change="changeImage($event)" ref="avatarInput"  type="file" accept="image/png, image/jpg, image/jpeg"/>
            <div class="plus">
               <img src="../assets/images/pic.png">
               <span>上传图片</span>
            </div>
            <img class="previewImg" v-if="avatar" :src="avatar" @click="setAvatar">
        </div>
        <img v-for="(item, index) in imgList" :key="index" :src="item" />
        </form>
        <span class="word-num-tips" :class="{'pass': cardContent.length > 1000}">{{wordNumTips}}/1000</span>
        <div class="btn-publish" @click="publishPost()">发布</div>
        <div id="loading" v-if="isLoading[1]">
            <div>
                <img src="../assets/images/successed.png">
                <p>帖子发布成功</p>
            </div>
        </div>
        <div id="loading" v-if="isLoading[0]">
            <div>
                <img src="../assets/images/loading.png">
                <p>帖子正在发布中，请稍等</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            avatar:'',
            isLoading:[false, false],
            cardContent: '',
            imgList: []
        }
    },
    methods:{
        publishPost:function(){
            let title = document.getElementById('title').value;
            let content = document.getElementById('content').value;
            let x = document.getElementById('saveImage').files[0];
            if(title === '') {
                this.$toast.show({
                    text: '请输入帖子标题',
                    type: 'text'
                });
                return;
            }
            if(content === '') {
                this.$toast.show({
                    text: '请输入帖子内容',
                    type: 'text'
                });
                return;
            }
            
            let that = this;
            that.isLoading = [true, false];
 
            if(x !== undefined) {
                let params = new FormData() ; //创建一个form对象  
                params.append('file', x, x.name);  //append 向form表单添加数据 
                //添加请求头  通过form添加的图片和文件的格式必须是multipart/form-data  
                let config = {  
                    headers:{'Content-Type':'multipart/form-data'}  
                };  
                this.$axios.post("post/uploadPostFile",params,config)  
                .then(function(response){  
                    var data = response.data;
                    if(data.succ === 'ok') {
                        var uuid = data.msg;

                        this.$axios.post("post/publishPost",{
                            uuid: uuid,
                            manifestoTitle: title,
                            postContent: content
                        })
                        .then((res) => {
                            that.isLoading = [false, true]
                            setTimeout(function(){
                                that.isLoading = [false, false];
                                that.$router.back();
                            },1500) 
                        })
                        .catch((err) => {
                            that.isLoading = [false, false]
                            this.$toast.show({
                                text: '帖子发布失败',
                                type: 'text'
                            });
                        })
                    }
                    
                    
                }.bind(this))  
                .catch(function (error) {  
                    console.log(error);  
                })
            } else {
                this.$axios.post("post/publishPost",{
                    manifestoTitle: title,
                    postContent: content
                })
                .then((res) => {
                    that.isLoading = [false, true]
                    setTimeout(function(){
                        that.isLoading = [false, false];
                        that.$router.back();
                    },1500) 
                })
            }
        },
        changeImage(e) {
            // let that = this;
            // const files = e.target.files;
            // for(var i = 0; i < files.length; i++) {
            //     var file = files[i];
            //     var reader = new FileReader();
            //     reader.readAsDataURL(file)
            //     reader.onload = function(e) {
            //         that.imgList.push(this.result)
            //     }
            // }

            var file = e.target.files[0]
            console.log(file.type)
            if(file.type !== 'image/jpeg' && file.type !== 'image/jpg' && file.type !== 'image/png') {
                this.$toast.show({
                    text: '图片格式必须为png/jpg/jpeg',
                    type: 'text'
                });
                return;
            }
            var reader = new FileReader()
            var that = this
            reader.readAsDataURL(file)
            reader.onload = function(e) {
                that.avatar = this.result
            }
        },
        setAvatar() {
            this.$refs.avatarInput.click()
        },
    },
    computed: {
        wordNumTips() {
            return this.cardContent.length;
        }
    },
    mounted() {
        this.$setNavTitle('发布帖子');
    }
}
</script>

<style lang='less' scoped>
.input-box{
    width: 100%;

    height: 150px;
    margin-top:10px;
    input{
        height: 50px;
        width: 100%;
        padding-left: 10px;
        color: #212121;;
        border-bottom: 1px solid #f4f4f4;
        font-size: 16px;
    }
    .content{
        width: 100%;
        font-size: 14px;
        height: 100px;
        box-sizing: border-box;
        padding: 10px;
        resize: none;
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

    }
    .plus{
        text-align: center;
        width: 80px;
        height: 80px;
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
    top: 310px;
    font-size: 14px;
    color: white;
    background: #f3772e;
    
    padding: 4px 12px;
}
.previewImg{
    position: absolute;
    width: 80px;
    height: 80px;
    top: 30px;
    left: 100px;
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
.word-num-tips{
    position: absolute;
    top: 270px;
    right: 20px;
    font-size: 12px;
    color: #5a5a5a;
}
.word-num-tips.pass{
    color: red;
}
</style>
