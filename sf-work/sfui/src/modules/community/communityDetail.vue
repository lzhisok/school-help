<template>
    <div ref="matchDetailPage">
        <!-- <v-navbar class="navbar-demo2" setBgColor="#fff">帖子详情</v-navbar> -->
        <div class="wrap" ref="comentList">
            <div class="matchDetail">
            <div class="matchDetail-title">
                {{detailContent.manifestoTitle}}
            </div>
            <div class="matchDetail-user-msg">
                <div class="user-avatar">
                    <img :src='commentHeadImgUrl(detailContent.publishManNum)'>
                    <div class="head-decorate" v-if="detailContent.headImageType !== 0">
                        <img :src="headDecorate(detailContent.headImageType)" />
                    </div>
                </div>
                <div class="user-msg">
                  <span v-if="detailContent.publishEntrance === 0">{{detailContent.publishManName}}</span>
                  <span v-else-if="detailContent.publishEntrance === 1">{{detailContent.orgName}}组委会</span>
                  <span v-else-if="detailContent.publishEntrance === 2">脸谱行动官方组委会</span>
                  <p>{{detailContent.publishTimeText}}</p>
                </div>
                <div class="visitNum">
                    <img src="../../assets/images/view.png">
                    <span>{{detailContent.visitNum}}</span>
                </div>
                <div class="btn-share">
                    <!-- <img src="../../assets/images/view.png"> -->
                    <span @click="handleShare">分享</span>
                </div>
            </div>
            <!-- content -->
            <div class="matchDetail-content" v-if="detailContent.postType === 0">
                <img :src="getImgUrl(detailContent.videoUrl)" v-if="detailContent.videoUrl !== ''">
                <p class="detail-content-text">{{detailContent.postContent}}</p>
            </div>
            
            <div class="video-wrap" v-else-if="detailContent.postType === 1">
                <video ref="videoPlayer" :src="detailContent.videoUrl" :poster="detailContent.coverUrl" controls preload="auto"></video>
                <!-- <img class="video-coverImg" :src="detailContent.coverUrl" ref="videoCoverImg" v-show="isShowVideoCoverImg" /> -->
                <!-- <img class="btn-play" src="../../assets/images/play.png" @click="handlePlay" v-show="isShowBtnPlay" /> -->
            </div>

            <div class="like-block" @click="like()" v-if="isShow">
                <img src="../../assets/images/love.png">
                <span>{{detailContent.likeNum}}</span>

            </div>
            <div class="like-block" style="border:1.5px solid #f39e13;" @click="cancleLike()" v-if="!isShow">
                <img src="../../assets/images/love2.png">
                <span style="color:#f39e13">{{detailContent.likeNum}}</span>

            </div>
        </div>
        <v-tab :line-width="2" active-color='#f7c300' bar-active-color="#f7c300" custom-bar-width="80px">
            <v-tab-item selected @on-item-click="onItemClick1()">全部评论({{commentCount}})</v-tab-item>
            <v-tab-item @on-item-click="onItemClick2()" disabled></v-tab-item>
            <v-tab-item disabled></v-tab-item>
        </v-tab>
        <div v-if="showtTab">
            <div class="commentlist">
                <div class="commentItem" v-for="(item,key) in commentlist" :key="key">
                    <div class="itemImg">
                        <img :src='commentHeadImgUrl(item.commentNum)'>
                    </div>
                    <div class="itemContent">
                        <span>{{item.commentName}}</span>
                        <div>第{{key+1}}楼 | {{item.commentTimeText}}</div>
                        <p>{{item.commentContent}}</p>
                    </div>
                </div>
                <div class="no-data">没有更多数据了哦~</div>
            </div>
        </div>
        <div v-if="!showtTab">
            <div class="likelist">
                <div class="likeItem" v-for="(item,key) in likelist" :key="key">
                    <div class="itemImg">
                        <img :src='commentHeadImgUrl(item.likeManNum)'>
                    </div>
                    <div class="itemContent">
                        <span>{{item.likeManName}}</span>
                    </div>
                    <div class="itemTime">第{{key+1}}楼 | {{item.likeTimeText}}</div>
                </div>
                <div class="no-data">没有更多数据了哦~</div>
            </div>
        </div>
        </div>

        <!-- 评论 -->
        <div class="comment-container">
            
            <input type="text" v-model="commentContent" placeholder="评论一下呗！" maxlength="1000">
            <span class="btn-comment" @click="comment()">发表</span>
            
        </div>
        <loading v-show="isShowLoading"></loading>
    </div>
</template>

<script>
import Vue from 'vue';
import { Tab, TabItem,Toast } from 'sfmui'
import VideoPlayer from 'vue-video-player';
Vue.component(Tab.name, Tab);
Vue.component(TabItem.name, TabItem);

Vue.use(Toast);
Vue.use(VideoPlayer)
export default {
    data() {
        return {
            commentContent:'',
            commentlist:'',
            commentCount:"",
            likelist:'',
            likeCount:'',
            detailContent:"",
            isShow:true,
            uuid:"",
            showtTab:true,
            isShowLoading: false,
            isShowVideoCoverImg: true,
            isShowBtnPlay: true,
            currentPageComment: 1,
            pageSizeComment: 15,
            canScroll: true
        }
    },
    created(){
        let uuid = this.$route.params.uuid;
        this.uuid = uuid;
        this.getMatchDetail(uuid);

    },
    computed: {
      player() {
        return this.$refs.videoPlayer.player
      }
    },
    methods:{
        commentHeadImgUrl(val) {
            return 'http://srs.sf-express.com/filemange/' + val + '.jpg';
        },
        getMatchDetail:function(uuid){
            let that = this;
            this.$axios.post('post/queryPostDetailsInfo',{"uuid":uuid})
            .then(function (response) {
                var data = response.data;
                var result = data.result;
                that.detailContent = result;
                that.commentCount = that.commentlist.length;
               if(result.yetLike === 'yes') {
                    that.isShow = false;
                } else if(result.yetLike === 'no') {
                    that.isShow = true;
                } 

            })
            .catch(function (error) {
                console.log(error);
            });
        },
        getCommentData() {
            let that = this;
            this.$axios.post('post/selectComment',{
                uuid: this.uuid,
                currentPage: this.currentPageComment,
                pageSize: this.pageSizeComment
            })
            .then(function (response) {
                var data = response.data;
                if(data.succ === 'ok') {
                    var list = data.result.list;
                    that.commentCount = data.result.total;
                    if(list.length !== 0) {
                        that.commentlist = list; 
                        that.currentPageComment += 1;  
                        that.loadMoreComment();                     
                    }
                }

            })
            .catch(function (error) {
                console.log(error);
            });
        },
        loadMoreComment() {
            let that = this;
            var comentListDom = this.$refs.comentList;
            comentListDom.addEventListener('scroll', function() {
                if(!that.canScroll) {
                    return;
                }
                var offsetHeight = comentListDom.offsetHeight
                var scrollTop = comentListDom.scrollTop;
                var scrollHeight = comentListDom.scrollHeight;
                if(offsetHeight + scrollTop > scrollHeight -20) {
                    that.canScroll = false;
                    that.isShowLoading = true;
                    that.$axios.post('post/selectComment',{
                        uuid: that.uuid,
                        currentPage: that.currentPageComment,
                        pageSize: that.pageSizeComment
                    })
                    .then(function (response) {
                        var data = response.data;
                        if(data.succ === 'ok') {
                            var list = data.result.list;
                            if(list.length !== 0) {
                                that.commentlist = that.commentlist.concat(list);
                                that.currentPageComment += 1;
                                that.canScroll = true;
                            } else {
                                that.canScroll = false;
                            }
                            that.isShowLoading = false;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
                }
            })
        },
        like:function(){
            this.isShowLoading = true;
            let uuid = this.uuid;
            let that =this;
            this.$axios.post('post/likePost', {
                "uuid":uuid
            })
            .then(function (response) {
                if(response.data.succ === 'ok') {
                    that.isShow = false;
                    that.detailContent.likeNum +=1;
                    // that.getMatchDetail(that.uuid);
                    that.isShowLoading = false;
                }
            })
            .catch(function (error) {
               that.isShowLoading = false;
            });

        },
        onItemClick1(){
            this.showtTab = true;

        },
        onItemClick2(){
            this.showtTab = false;


        },
        cancleLike:function(){
            this.isShowLoading = true;
            let uuid = this.uuid;
            let that = this;
            this.$axios.post('post/cancelLikePost',{
                "uuid":uuid
            })
            .then(function (response) {
                if(response.data.succ === 'ok') {
                    console.log(response)
                    that.isShow = true;
                    that.detailContent.likeNum -=1;
                    // that.getMatchDetail(that.uuid);
                    that.isShowLoading = false;
                }
            })
            .catch(function (error) {
                that.isShowLoading = false;
            });

        },
        comment(){
            if(this.commentContent === '') {
                this.$toast.show({
                    text: '评论内容不能为空',
                    type: 'text'
                })
                return;
            }
            if(this.sensitiveWord(this.commentContent)) {
                this.$toast.show({
                    text: '评论失败，请勿输入特殊或敏感字符',
                    type: 'text'
                })
                return;
            }
            this.isShowLoading = true;
            let uuid = this.uuid;
            let commentContent = this.commentContent;

            // xss攻击评论内容过滤
            function filterContent(s) {
                var pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>~@#￥……&*——|{}]");
                var rs = ""; 
                for (var i = 0; i < s.length; i++) { 
                    rs = rs+s.substr(i, 1).replace(pattern, ''); 
                }
                return rs;
            }

            let that = this;
             this.$axios.post('post/matchPostComment',{
                 "uuid":uuid,
                 "commentContent":filterContent(commentContent)
            })
            .then(function (response) {
                //  window.location.reload();
                if (response.data.succ === 'ok') {
                    that.$toast.show({
                        text: '评论成功',
                        type: 'text'
                    })
                    that.currentPageComment = 1;
                    that.getCommentData(that.uuid);
                    that.isShowLoading = false;
                    that.commentContent = '';
                    that.canScroll = true;
                } else {
                    that.$toast.show({
                        text: '评论失败，请勿输入特殊或敏感字符',
                        type: 'text'
                    })
                    that.isShowLoading = false;
                    that.commentContent = '';
                }
                
                
               
            })
            .catch(function (error) {
                that.$toast.show({
                    text: '评论失败，请勿输入特殊或敏感字符',
                    type: 'text'
                })
                that.isShowLoading = false;
                that.commentContent = '';
            });


        },
        // 视频
        handlePlay() {
            this.$refs.videoPlayer.play();
            this.isShowVideoCoverImg = false;
            this.isShowBtnPlay = false;
        },
        handleShare() {
            var url = 'index.html' + window.location.hash;
            var content = '万事俱备，就差你了！'
            var title = '「脸谱行动」这些视频我可以看一整天！';
            var picUrl = "http://srs.sf-express.com/images/share.png";
            var shareWord = "";
            ExpressPlugin.shareMicroService(url,content,title,picUrl,shareWord);
        },
        headDecorate(headImageType) {
            if(headImageType === 1) {
                return require("../../assets/images/avatar1.png")
            } else if(headImageType === 2) {
                return require("../../assets/images/avatar2.png")
            } else if(headImageType === 3) {
                return require("../../assets/images/avatar3.png")
            }
        },
        getImgUrl(url) {
            return _imgConfigUrl + '/sfimimgload?path=' + url;
        },
        sensitiveWord(name) {
            // 多个敏感词，这里直接以数组的形式展示出来
            var text='操|AV|hz|sm|PK|PX|C4|usk|flg|GCD|gcd|GHB|rfa|sex|TND|voa|.ru|.cc|SQ|tmd|nnd|89-|cnd|dpp|TMD|xxx|t56|LSD|qy6|TEL|淫|乳|阴|奸|裸|骚|穴|嫖|碼|陰|姦|枪|炮|肏|屄|弓|弩|氰|铊|氟|氯|胂|磷|GPS|砷|TNT|PCP|肝|肾|肼|膦|床|K粉|18dy|pn95|3退|A级|A片|fuck|J巴|lama|nacb|nmis|porn|shit|suck|svdc|taip|TNND|wo98|操B|插B|大b|二B|狗b|傻B|傻X|F·B|T·W|Z·W|Y·D|S·F|a片|2奶|k粉|cdjp|dafa|dfdz|falu|>jnv|9评|G点|MDMA|SARS|红K|.exe|6合|c-sz|hqzg|it01|wj2y|FUCK|反G|六4|法L|9坪|h漫|h图|99dv|嫩b|RX65|T牌|qvod|3箭|654K|55MM|AK47|ATOM|b毛|3健|3棱|CP99|G水|lqb78|zsgnw|lqb18|cxmyw|dk555|laohj|we399|h59me|boxun|17大|18禁|3d肉|Kx粉|naive|paper|黄JU|FALun|yinh|anime|bitch|Bjork|bjork|Party|fldfh|598gj|ab003|baiok|buslz|djkdh|haosf|hy898|jsxys|ka888|ka999|kaobi|meiti|qqywf|s3186|typou|weizi|wt800|xgzrc|xj818|zdbmm|zs007|zt286|bb弹|fa轮|看jj|daai8|zqfpw|台du|89之|tusha|FL功|自fe|9ping|zifen|XX功|看JJ|S2940|HCCH2|630XP|54手|92手|63式|77手|38式|TV棒|64手|42酮|TVUSB|DM528|762mm|qiang|ADBOX|80色|qi狗|GLOCK|M1911|假BI|54狗|64狗|色BB|92式|64式|54式|77式|BB弹|槍qq|fa票|K 粉|六合|刻章|法轮|乱伦|做鸡|罗干|鬼村|昏药|春药|疆独|藏独|禁书|特码|共狗|达赖|暴动|反中|拉登|幼女|喷剂|罢工|毛片|套牌|军火|针孔|女优|朱蒙|征途|私服|两会|肉棍|退党|反华|反共|换妻|偷拍|露点|走光|丑化|党国|抵制|怀旧|倒退|共奴|大珐|反动|策屁|赛马|特马|色情|可儿|乱交|台湾|鸡巴|露毛|肉棒|龟头|玉龟|奢恋|毛派|邓派|冰毒|办证|诈骗|政治|大荣|西藏|贪官|迷药|罢食|蜜洞|泄题|罢餐|天浴|偷电|盗电|明慧|拉凳|江氏|假币|動乱|性奴|假钞|无界|升达|杨林|代考|替考|iow.cn|tzz.cn|搜客|柑|mp654k|退欓|98qian|k20128|dzboo5|szbzcn|51test|ksj8cn|3ufcom|lnimcn|zgque6|bj0099|wsbz68|dkw800|ktdbzj|jczj08|jcnlae|80hhcn|97xxoo|dzb028|劣乐|cz3456|1Pondo|hentai|huanet|incest|Judies|Kundun|making|simple|wangce|yuming|爱迪|八九|八老|巴赫|罢吃|罢饭|罢课|白军|白梦|包夜|保钓|报禁|鲍戈|鲍彤|暴動|暴干|暴乱|暴亂|暴政|北韩|贝领|被逼|被虐|被迫|逼样|变态|婊子|冰火|波霸|博彩|博讯|薄格|苍焱|藏獨|操逼|操比|操蛋|操你|操死|操他|插插|插她|插你|插他|插我|柴玲|常劲|常委|潮吹|车仑|陈军|陈蒙|陈庆|成人|城管|程凯|程真|赤匪|赤化|抽插|臭作|处女|吹萧|春藥|痤疮|打倒|大逼|大比|大彩|大法|大纪|大禁|大陆|大史|代办|代辦|代开|代開|代写|代孕|耽美|弹劾|弹夹|党棍|党禁|党魁|荡妇|登辉|底裤|弟疼|弟痛|弟子|調教|丁元|顶级|东社|东突|东洲|动乱|独裁|独夫|赌球|多党|多黨|多维|屙民|俄国|恶党|恶搞|恶警|二逼|发愣|发抡|发仑|发伦|发囵|发沦|发纶|发轮|发论|发票|發倫|發淪|發輪|發論|發票|法功|法会|法愣|法抡|法仑|法伦|法囵|法沦|法纶|法倫|法淪|法輪|法论|法論|法谪|法正|砝仑|砝伦|砝轮|反党|反攻|废统|分裂|粉刺|封杀|風花|腐败|腐敗|干她|干妳|干你|干他|甘油|肛交|肛门|高潮|高干|高幹|高官|高瞻|睾丸|戈扬|哥疼|哥痛|鸽派|革命|蛤蟆|更衣|工力|公安|公款|功法|功学|功友|攻台|共产|共党|共黨|共匪|共军|狗逼|狗操|狗粮|狗娘|广闻|龜頭|郭平|国军|国贼|哈批|汉风|何勇|和弦|河殇|黑车|嘿咻|红兽|红志|红智|宏恩|宏法|宏志|宏治|洪传|洪吟|洪志|洪治|洪智|紅志|紅智|胡江|胡派|胡平|胡温|胡瘟|胡系|虎机|护法|护士|换偶|換妻|黃菊|黄祸|黄局|黄菊|黄色|黄翔|簧片|慧网|昏藥|活佛|活体|鸡八|鸡吧|基督|激情|极景|纪元|加府|贾系|假鈔|监听|贱逼|贱比|江胡|江驴|江罗|江牌|江派|江青|江宋|江系|江贼|江朱|江猪|僵贼|疆獨|讲法|交班|交媾|交警|叫春|教徒|接班|姐疼|姐痛|锦涛|近平|近親|禁看|经文|精液|警察|静坐|九评|绝版|军车|军妓|軍火|卡通|开苞|康本|抗议|空难|空難|恐共|口技|口交|狂操|狂插|狂干|狂搞|捆绑|喇嘛|烂逼|烂比|烂货|劳改|劳教|老江|老毛|雷管|冷宽|李录|李禄|李鹏|李鵬|連發|联总|炼功|林彪|林斌|凌锋|凌辱|菱恝|刘刚|刘青|流脑|流亡|六彩|六四|鲁俊|陆肆|陆委|亂倫|抡功|伦公|伦功|伦攻|沦公|沦功|沦攻|轮大|轮公|轮功|轮攻|倫公|倫功|倫攻|淪公|淪功|淪攻|輪公|輪功|輪攻|论公|论功|论攻|論公|論功|論攻|羅幹|妈逼|妈个|妈批|媽個|麻古|麻衣|麻醉|马馼|码会|卖逼|卖比|卖国|猫肉|貓肉|毛共|毛贼|美服|美甲|美腿|妹疼|妹痛|猛插|蒙独|蒙汗|迷魂|迷香|迷藥|秘录|绵恒|民国|民警|民联|民殇|民意|民运|民運|民阵|民猪|民主|明Hui|明hui|魔教|母子|内裤|内射|奶子|闹事|你爸|牛逼|牛比|女女|女優|虐待|诺龙|喷精|喷尿|彭钢|屁股|屁眼|骗局|騙局|迫害|破处|破网|蒲团|祁建|齐墨|汽狗|千源|前考|钱达|强暴|强歼|强卫|抢盐|乔石|窃听|亲美|秦晋|情妇|情色|请愿|庆红|球彩|权斗|群交|群射|人大|人权|日逼|日你|日您|日批|日他|肉洞|肉欲|辱师|三级|三級|三退|三唑|色狼|色友|色欲|沙鹰|傻逼|煞笔|上访|尚勇|少妇|射精|神佛|沈彤|升達|升天|盛雪|失密|师涛|石戈|示威|手狗|手铐|首长|首長|兽交|书记|書記|舒淇|熟女|双规|爽死|氵去|水扁|税力|丝袜|私彩|私处|私营|思潮|斯诺|宋平|素女|台獨|台独|台盟|谭力|唐捷|涛哥|天怒|天权|天葬|舔奶|挺胡|同房|童屹|统独|统战|捅你|捅我|偷窥|偷情|透视|屠杀|吐血|团派|退团|脱党|脱光|脱团|脱衣|外蒙|汪岷|亡党|亡国|王策|王丹|王刚|网特|网赚|伪水|尾行|瘟家|文革|翁虹|瓮安|我操|我草|我日|我色|无毛|無界|五不|伍凡|武警|吸储|吸儲|洗脑|洗瑙|下体|限制|香功|肖强|邪党|邪恶|邪教|谢安|新党|刑警|行房|邢铮|性爱|性愛|性福|性感|性交|性息|胸部|胸罩|熊炎|熊焱|修炼|修煉|薛伟|学潮|学联|学运|血卡|亚热|言禁|颜射|艳舞|阳具|阳痿|杨巍|杨周|一党|一黨|伊東|乙醚|义解|亦凡|櫻井|游行|右派|幼齿|幼交|诱惑|舆论|欲望|圆满|援交|岳武|杂种|脏独|造爱|造反|则民|择民|泽东|泽民|贼民|炸药|张钢|张健|张林|赵南|哲民|真相|真象|镇压|正法|郑义|政变|支那|制服|中功|中共|猪操|专柜|专政|专制|專政|專制|子弹|自殘|自焚|自摸|自拍|自杀|自慰|作爱|坐交|坐台|做爱|做雞|做鸭|黄镇|黄敬|薄熙|徐明|老丁|贪污|www.cn|xp.com|u88.cn|jkk.tw|www.am|sdo.ms|171.cn|鹰派|禁播|二奶|周容|陈云|方毅|吴德|耿飚|彭冲|王震|彭真|谢非|吴仪|王克|刘淇|处男|血恋|偷欢|censor|fa lun|fanhua|妓女|我靠|登陆|玉茎|王爷|雏妓|赌博|国歌|股歌|啊扁|官场|群砍|炸弹|买春|被插|鸟巢|缺陷|色戒|复活|阿扁|氨水|爆炸|丙酮|布赫|催眠|催情|大麻|地震|毒素|疯药|豪江|濠江|火药|剑奴|降頭|借种|老温|麻姑|麻药|马药|吗啡|迷幻|迷昏|迷情|缅古|杀手|手雷|偷香|舞男|邪僧|性病|性媾|性药|性夜|鸦片|盐酸|艳降|艳遇|罂粟|早泄|北姑|波胆|春宫|吹箭|叫鸡|卖春|人祸|大庄|盗取|男妓|盘口|赔率|三陪|下流|尤物|骚货|摇奖|116738|200100|251700|581578|8happy|ake163|bet365|cks123|cnepep|cosway|Cosway|czj163|eweber|gogoer|gzyrly|ha2.cn|hngyjt|jdh011|lhjykq|midasc|niaita|now.cn|qdjywq|rorcll|sar120|wengan|wes.tw|xingsc|yuyify|zxzgjx|阿宾|安定|挫仑|气狗|三挫|论文|斑蝥|办怔|辦證|包养|报码|暴菊|爆菊|鞭满|变牌|厕奴|长狗|贷开|弹种|盗号|电狗|电鸡|赌具|根浴|狗友|华闻|黄冰|贱货|贱人|江毒|警徽|菊暴|菊爆|军刺|军转|開票|磕彰|嗑药|六死|漏题|卖身|卖血|灭共|男奴|嫩逼|浓精|女奴|泡友|陪聊|氣槍|铅弹|亲共|情杀|犬交|人弹|剩火|尸博|熟妇|骰子|推翻|无码|希脏|霰弹|性虐|一肖|蝇毒|咏妓|有码|脏毒|中特|助考|庄家|左棍|雞巴|禁片|巨波|色界|色诱|爽片|xxfysd|操她|操它|出售|干它|价格|开票|猫池|目漂|批发|凭办|招商|焊接|黄赌|蓝芒|紫田|唐子|何山|张戎|虐杀|应招|林海|黄琦|刘荻|颜均|李志|赵岩|封锁|推油|朱德|万里|泛绿|泛蓝|自由|双轨|伊东|调教|近亲|连发|樱井|风花|产党|伪大|陆独|共独|殃视|打压|蒋公|独立|共贼|亡共|集会|维权|罢市|买断|聚集|信访|征地|拆迁|复员|示wei|讨薪|暴行|紫阳|九凭|法lun|九抨|反日|屠华|参拜|抗日|围攻|靖国|灭日|惨案|军区|军队|保过|包过|贷款|带考|司考|押题|切腹|打手|开锁|套现|一码|彩宝|合彩|足交|富姐|做台|找女|找男|证件|导弹|肉牛|肉羊|牧业|报税|伟哥|爱欲|税票|牛羊|扑克|作弊|麻将|面瘫|趣谷|暗杀|奶交|菩提|麻果|病毒|足疗|足浴|搬迁|种猪|精子|女装|男装|鞋帽|办證|月嫂|洗牙|牙石|洁牙|牙疼|龋齿|虫牙|正牙|拔牙|牙科|防弹|警棍|疫苗|水军|飞标|飞镖|探头|破解|斗欧|毒品|自考|警服|电棍|报关|偷税|逃税|漏税|税务|审计|年检|签证|离婚|逃婚|白洁|苍主|叱咤|创魂|宠奴|刀霸|呻吟|情欲|東宮|FDZONE|麻烟|冷却|偷電|监聼|跟听|摄像|克隆|罚没|走私|短信|D2S500|雷霆|稀土|米粒|mai人|丁烯|丙腈|丁腈|苄醇|苯醌|杜廷|山奈|升汞|白砒|砒霜|帝绿|苔绿|塔崩|索曼|沙林|光气|氮芥|烟碱|蒜醇|华果|腈果|蚜螨|亚砜|亚果|硫丹|大隆|敌鼠|安妥|甘伏|窃电|钢珠|冰Ice|媚药|疯丸|撬锁|矿脂|甲撑|单刃|双刃|火棉|硝宇|泰安|铵煤|铵木|铵磺|铵邻|铵萘|铵胍|岩石|雷汞|雷银|虎头|秃鹰|武器|瓦斯|按摩|刀具|爱刀|铀235|霸王|杀伤|匕首|奖券|兵团|纵情|毒碱|超速|隐形|丁香|弹头|删帖|器官|猎箭|自爆|农药|黑市|黑梯|虎骑|爆破|色医|驾照|护照|健卫|艳情|金钟|折刀|兰博|猎豹|送养|领养|骆冰|妞妞|色图|乙腈|大宝|赌场|艳帝|梭哈|人皮|禽兽|黄站|美男|麻狗|涉毒|冰糖|猎狗|皮碗|双管|解码|拦截|屏蔽|硬币|面具|猎艳|伪币|狩猎|点色|冰砖|发漂|高爆|高考|跟踪|艳母|地磅|卧底|牙签|唐僧|出台|阳江|野战|东宫|DM7000|改火|军用|A4U平|A4U网|A4U站|狗专|气皇|长刺|狙击|qie听|Zha药|白粉|白刃|暴力|采花|彩票|JIA币|白冰|钞票|短狗|黑狗|火狗|假rmb|军狗|军品|开刃|镁粉|手拷|战刀|追月|春泄|fapiao|戈博|工商|麻谷|甩刀|假比|考研|雷豹|力霸|春堂|鲍鱼|露鲍|嫂嫂|迷离|蜜桃|名刀|耻蜜|虐恋|秦氏|氢弹|散弹|色域|山猪|兽兽|淘刀|舔弄|硝铵|冰古|纯古|晶冰|战狗|艳史|投票|报仇|纯冰|票据|文凭|武力|精鹰|本色|好色|刷票|赌波|夺爱|夺妻|官能|画魂|宦妻|剑魔|江湖|巨轮|狼车|猎情|龙使|掠爱|萝莉|眉姐|密诱|脑王|逆侠|破局|情乱|人欲|如焉|色惑|绳师|胎记|庭妍|袭警|戏舞|亵渎|玄战|艳福|艳飘|隐杀|众香|气狙|罢考|码报|假钱|马报|狠操|外挂|传销|双鹰|弹药|虎牙|刺刀|甩棍|助勃|鹰牌|军刀|伪钞|涩爱|官战|春色|核弹|跳刀|军刃|砍刀|cocain|抽奖|迁都|中奖|假证|SevBBS|卖槍|妓院|罩杯|青楼|内衣|亵衣|色魔|初夜|蕾丝|老鸨|蹂躏|勾引|偷精|吹箫|失身|失禁|虐爱|虐情|一夜|情人|小妞|玩偶|娇妻|流氓|情夫|春光|春梦|猛男|艳星|艳行|艳记|艳事|寡妇|金瓶|禁果|浴女|外遇|同居|缠绵|暧昧|饥渴|出轨|堕落|坠落|沉沦|御用|调情|调戏|风流|不良|寻欢|合欢|偷腥|挑情|同眠|菲彩|跑马|证务|卖胆|勃起|视频|基友|脚交|滥交|口活|篡逆|丹警|金血|蛮村|贱妇|胸摧|發缥|发缥|口爆|揉奶|大奶|耳机|杀死|拉丹|压迫|非典|回民|falong|主席|改革|开放|杂志|中俄|诽闻|无能'
            var arrMg = text.split("|");
            console.log(arrMg.length)
            var _name=name;
            for (var i = 0; i < arrMg.length; i++) {
            // 创建一个正则表达式
                var r = new RegExp(arrMg[i], "ig");
                if(r.test(_name)) {
                    console.log('敏感词');
                    return true;
                }
                // _name = _name.replace(r, "*");
            }
            // if(_name.indexOf("*")>-1)
            // {
            //     return true;
            // }else{
            //     return false;
            // }
        },
    },
    mounted() {
        console.log(window.location.href)
        console.log(window.location.hash)
        this.getCommentData();
        this.$refs.matchDetailPage.scrollTo(0, 10)
        this.$setNavTitle('帖子详情')
    }
}
</script>

<style lang='less' scoped>
.wrap {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    overflow: auto;
}
.no-data{
    text-align: center;
    color: #ccc;
    font-size: 12px;
    padding: 20px 0;
}
.sfmui-tab {
    margin-top: 15px;
    height: 40px !important;
}
.matchDetail{
    margin-top: 10px;
    background: white;
    padding: 15px;
    .video-wrap{
        position: relative;
        .video-coverImg{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
        }
        .btn-play{
            position: absolute;
            top: 50%;
            left: 50%;  
            width: 50px;
            height: 50px;
            transform: translate(-50%, -50%);
        }
        video{
            display: block;
            width: 100%;
        }
    }
    .matchDetail-title{
        font-size: 16px;
        color: #333;
        font-weight: bold;
        word-break: break-word;
    }
    .matchDetail-user-msg{
        margin: 15px 0px;
        display: flex;
        display: -webkit-flex;
        .user-avatar{
            position: relative;
            width: 40px;
            height: 40px;
            .head-decorate{
                position: absolute;
                top: -9px;
                left: -7px;
                img{
                    width: 52px;
                    height: auto;
                }
            }
            img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border-radius: 50%;
            }
        }
        .user-msg{
            flex: 1;
            margin-left: 10px;
            span{
                color: #666;
                font-size: 14px;

            }
            p{
                color: #999;
                font-size: 12px;
            }
        }
        .visitNum{
            img{
                width: 23px;
                height: 16px;
                vertical-align: middle;
            }
            span{
               color: #999;
               position: relative;
               top: 2px;
            }
        }
        .btn-share{
            margin-left: 10px;
            span{
                display: block;
            }
        }
    }
    .matchDetail-content{
        font-size: 18px;
        color: #333;
        img{
            display: block;
            margin: 0 auto;
            max-width: 100%;
        }
        .detail-content-text{
            margin-top: 20px;
            font-size: 16px;
            white-space: pre-wrap;
            word-break: break-word;
        }
    }
    .matchDetail-cuver{
        margin: 15px 0px;
        width: 100%;
        height: 150px;
        position: relative;
        img{
            width: 100%;
            height: 100%;
        }
        .btnPlay{
                position: absolute;
                top: 50%;
                left: 50%;
                width: 25px;
                height: 25px;
                margin-left: -12.5px;
                margin-top: -12.5px;
            img{
                width: 100%;
                height: 100%;
            }
        
        }
        .time{
            position: absolute;
            bottom: 10px;
            right: 10px;
            font-size: 14px;
            color: white;
        }
    }
    .like-block{
        margin: 20px auto 0;
        width: 120px;
        height: 40px;
        border-radius: 20px;
        border:1.5px solid #cccccc;
        text-align: center;
        line-height: 40px;
        img{
            width: 25px;
            height: 20px;
            vertical-align: middle;
            margin-top: -5px;
        }
        span{
            color: #ccc;
            font-size: 14px;
        }
    }
}
.comment-container{
    background: white;
    position: fixed;
    bottom: 0px;
    width: 100%;
    height: 50px;
    left: 0px;
    transform: translateZ(0); 
    input{
        margin: 5px;
        height: 40px;
        width: 78%;
        background: #f4f4f4;
        padding-left: 10px;
        font-size: 14px;
        border-radius: 2px;
    }
    .btn-comment{
        font-size: 14px;
        color: white;
        border-radius: 5px;
        margin-top: -5px;
        margin-right: 5px;
        vertical-align: middle;
        display: inline-block;
        width: 15%;
        height: 35px;
        line-height: 35px;
        text-align: center;
        background: rgb(243, 158, 19);
    }
}
.commentlist{
    background: white;
    position: relative;
    bottom: 50px;
    margin-top: 50px;
    .commentItem{
        display: flex;
        display: -webkit-flex;
        padding: 15px;
        border-bottom: 1px solid #f4f4f4;
        .itemImg{
            width: 40px;
            height: 40px;
            
            
            img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border-radius: 50%;
            }
        }
        .itemContent{
            flex: 1;
            margin: 0px 15px;
            span{
                font-size: 16px;
                color: #333;

            }
            div{
                margin-top: 5px;
                font-size: 12px;
                color: #999;
            }
            p{  margin-top: 5px;
                margin-bottom: 10px;
                font-size: 18px;
                word-break: break-word;
            }
        }

    }
}
.likelist{
    background: white;
    position: relative;
    bottom: 50px;
    margin-top: 50px;
    .likeItem{
         display: flex;
        display: -webkit-flex;
        padding: 15px;
        border-bottom: 1px solid #f4f4f4;
        align-items: center;
        position: relative;
        .itemImg{
            width: 40px;
            height: 40px;
            
            
            img{
                width: 100%;
                height: 100%;
                vertical-align: middle;
                border-radius: 50%;
            }
        }
        .itemContent{
            flex: 1;
            margin: 0px 15px;
            width: 90PX;
            span{
                font-size: 16px;
                color: #333;

            }
           
        }
        .itemTime{
            position: absolute;
            right: 20px;
        }

    }
}
</style>
