<template>
    <div class="repContainer scrollBarReset">
        <header class="clearfix">
            <div class="rep-id le form-height">
                <el-input :placeholder="$t('rapCompareLang.requesID')" icon="search" v-model="val">
                    <template slot="prepend">ID</template>
                </el-input>
            </div>
            <div class="check-style le form-height">
                <el-checkbox v-model="checked">{{$t('rapCompareLang.requestAllinterface')}}</el-checkbox>
            </div>
            <div class="le form-height" style="margin-left:20px;">
                <!--此处使用了自动记录点击事件-->
                <el-button type="primary" @click="getModule" sftag="event_id:sfopen_click_Search_Rap,key1:value1,key2:value2">
                    <span v-show="throttle">{{$t('rapCompareLang.rapSearch')}}</span>
                    <span v-show="!throttle">{{$t('rapCompareLang.rapQuery')}}</span>
                </el-button>
            </div>
        </header>
        <div>
            <span style="color:#DAA520;">{{$t('rapCompareLang.severDeg')}}</span>
        </div>
        <div class="content">
            <el-row :gutter="20">
                <el-col :span="6">
                    <div class="grid-content bg-purple">
                        <div class="tree-content scrollBarReset">
                            <el-tree :data="treeDate" node-key="id" default-expand-all :indent="25" :props="defaultProps" @node-click="checkNode" :render-content="renderContent">
                            </el-tree>
                        </div>
                    </div>
                </el-col>
                <el-col :span="18">
                    <div class="grid-content bg-purple">
                        <template v-if="!searchInit">
                            <div class="active-result" v-show="currentIndex != -1">
                                <!--头部-->
                                <div class="result-header">
                                    <div class="result-url le">
                                        <span class="fw">URL:</span>
                                        <span v-text="activeObj.showUrl"></span>
                                    </div>
                                    <div class="result-status ri" v-show="activeObj">
                                        <span>{{$t('rapCompareLang.state')}}</span> :
                                        <span style="color:#20a0ff;" v-if="activeObj.status == 'OK'">{{$t('rapCompareLang.succ')}}</span>
                                        <span style="color:red;" v-if="activeObj.status == 'Fail'">{{$t('rapCompareLang.fail')}}</span>
                                        <span style="color:rgb(218, 165, 32);" v-if="activeObj.status == 'Warning'">{{$t('rapCompareLang.abnormal')}}</span>
                                        <span style="color:#20a0ff;" v-if="activeObj.status == 'not'">{{$t('rapCompareLang.unrequested')}}</span>
                                    </div>
                                    <div class="refret-btn ri">
                                        <el-button type="primary" @click="sendGetResult" v-show="activeObj">{{activeObj.status == "not" ? $t('rapCompareLang.request'):$t('rapCompareLang.requestAgain')}}</el-button>
                                    </div>
                                </div>
                                <!--响应结果-->
                                <div class="result-data query">
                                    <div class="result-data-txt">
                                        <span>{{$t('rapCompareLang.requestParams')}} :</span>
                                    </div>
                                    <div class="result-content scrollBarReset ">
                                        <template v-if="currentIndex != -1 && activeObj.status == 'OK'">
                                            <JsonEdit :my-json="activeObj.reqParams"></JsonEdit>
                                        </template>
                                        <template v-else>
                                            <div class="empty-data">
                                                <span>{{$t('rapCompareLang.nData')}}</span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                                <!--请求结果-->
                                <div class="result-data">
                                    <div class="result-data-txt">
                                        <span>{{$t('rapCompareLang.responseResult')}} :</span>
                                    </div>
                                    <div class="result-content scrollBarReset">
                                        <template v-if="currentIndex != -1 && activeObj.status == 'OK'">
                                            <JsonEdit :real-resp="activeObj.data"></JsonEdit>
                                        </template>
                                        <template v-else>
                                            <div class="empty-data">
                                                <span>{{$t('rapCompareLang.nData')}}</span>
                                            </div>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <div class="user-select-png" v-show="currentIndex == -1">
                                <div class="user-select-container">
                                    <ul class="percentage">
                                        <!--正常-->
                                        <li class="percentage-list succ">
                                            <!--头部-->
                                            <div class="percentage-top">
                                            </div>
                                            <!--圆柱-->
                                            <div class="percentage-bottom"></div>
                                            <div class="percentage-childer" :style="{'height':succPercentage.he + 'px'}">
                                                <div class="percentage-text" v-text="succPercentage.percentage"></div>
                                                <div class="percentage-content"></div>
                                            </div>
                                        </li>
                                        <!--错误-->
                                        <li class="percentage-list fail">
                                            <!--头部-->
                                            <div class="percentage-top">
                                            </div>
                                            <!--圆柱-->
                                            <div class="percentage-bottom"></div>
                                            <div class="percentage-childer" :style="{'height':failPercentage.he + 'px'}">
                                                <div class="percentage-text" v-text="failPercentage.percentage"></div>
                                                <div class="percentage-content"></div>
                                            </div>
                                        </li>
                                        <!--错误-->
                                        <li class="percentage-list warning">
                                            <!--头部-->
                                            <div class="percentage-top">
                                            </div>
                                            <!--圆柱-->
                                            <div class="percentage-bottom"></div>
                                            <div class="percentage-childer" :style="{'height':warningPercentage.he + 'px'}">
                                                <div class="percentage-text" v-text="warningPercentage.percentage"></div>
                                                <div class="percentage-content"></div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                <div class="legend">
                                    <p class="legent-succ">
                                        <i class="legent-cicle"></i>
                                        <span class="legent-text">{{$t('rapCompareLang.matchSucc')}}
                                            <span v-text="succLength"></span>
                                        </span>
                                    </p>
                                    <p class="legent-fail">
                                        <i class="legent-cicle"></i>
                                        <span class="legent-text">{{$t('rapCompareLang.matchFail')}}
                                            <span v-text="failLength"></span>
                                        </span>
                                    </p>
                                    <p class="legent-warning">
                                        <i class="legent-cicle"></i>
                                        <span class="legent-text">{{$t('rapCompareLang.matchAbnormal')}}
                                            <span v-text="warningLength"></span>
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="user-not-select-id">
                                <span>{{$t('rapCompareLang.searchRapId')}}</span>
                            </div>
                        </template>
                    </div>
                </el-col>
            </el-row>
        </div>

    </div>
</template>
<script>
import { Notification } from "element-ui"
import JsonEdit from "./../../components/jsonEditor.vue"     //json对象
export default {
    name: "rapCompare",
    components: {
        JsonEdit,
    },
    data() {
        return {
            searchInit: true,
            throttle: true,
            val: "",
            saveId: -1,            //保存搜索的值
            portArrs: [],          //所有请求接口id  获取到数据的时候将他push到数组里面来
            portIds: [],
            succPort: [],          //正常接口
            failPort: [],          //错误接口
            warningPort: [],           //异常接口
            currentIndex: -1,
            currentNodeId: {
                id: -1,
                vNode: null
            },         //当前选中的item的id
            checked: true,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            treeDate: []
        }
    },
    computed: {
        activeObj() {
            if (this.currentIndex == -1 || this.portArrs.length == 0) {
                return ""
            } else {
                return this.portArrs[this.currentIndex]
            }
        },
        portSum() {
            return this.portIds.length;
        },
        failPercentage() {
            if (this.failLength == 0 || this.portSum == 0) {
                return {
                    percentage: "0%",
                    he: 0
                };
            } else {
                let r = (parseInt((this.failLength / this.portSum) * 1000));
                let s = (r / 10) * 3;
                let l = (parseInt((this.failLength / this.portSum) * 10000)) % 10 >= 5 ? r++ : "";
                return {
                    percentage: (r / 10) + "%",
                    he: s
                };
            }
        },
        succPercentage() {
            if (this.succLength == 0 || this.portSum == 0) {
                return {
                    percentage: "0%",
                    he: 0
                };
            } else {
                let r = (parseInt((this.succLength / this.portSum) * 1000));
                let s = (r / 10) * 3;
                let l = (parseInt((this.succLength / this.portSum) * 10000)) % 10 >= 5 ? r++ : "";
                return {
                    percentage: (r / 10) + "%",
                    he: s
                };
            }
        },
        warningPercentage() {
            if (this.warningLength == 0 || this.portSum == 0) {
                return {
                    percentage: "0%",
                    he: 0
                };
            } else {
                let r = (parseInt((this.warningLength / this.portSum) * 1000));
                let s = (r / 10) * 3;
                let l = (parseInt((this.warningLength / this.portSum) * 10000)) % 10 >= 5 ? r++ : "";
                return {
                    percentage: (r / 10) + "%",
                    he: s
                };
            }
        },
        failLength() {
            return this.failPort.length;
        },
        succLength() {
            return this.succPort.length;
        },
        warningLength() {
            return this.warningPort.length;
        }
    },
    mounted() {
        var that = this;
        //手动记录点击事件  埋点
        this.$nextTick(() => {
            that.$sfgather().track_clicks(that.$el.querySelector(".rep-id"), { key1: this.$t('rapCompareLang.clickinput') });
        })
    },
    methods: {
        getModule() {           //查询module
            if (!this.throttle) return;

            this.saveId = this.val;
            var parms = {
                id: this.val
            }
            this.throttle = false;
            this.resetAttribute();
            this.$httpExt().get("auto/queryModel", parms)
                .then((response) => {
                    this.searchInit = false;
                    if (response.succ == 'ok') {
                        this.getProts(response.result.moduleList)
                    } else {
                        this.throttle = true;
                        Notification.error({
                            title: '异常',
                            message: response.msg
                        });
                    }
                }, (response) => {
                    this.searchInit = false;
                    this.throttle = true;
                    Notification.error({
                        title: '异常',
                        message: response.msg
                    });
                })
        },
        dataClassify(name, id) {
            let succIndex = this.succPort.indexOf(id);
            let failIndex = this.failPort.indexOf(id);
            let warningIndex = this.warningPort.indexOf(id);
            failIndex >= 0 ? this.failPort.splice(failIndex, 1) : "";
            succIndex >= 0 ? this.succPort.splice(succIndex, 1) : "";
            warningIndex >= 0 ? this.warningPort.splice(warningIndex, 1) : "";
            switch (name) {
                case "Succ":
                    this.succPort.push(id);
                    break;
                case "Fail":
                    this.failPort.push(id);
                    break;
                case "Warning":
                    this.warningPort.push(id);
                    break;
                default: break;
            }
        },
        getResult(id, url, index, status) {                    //根据选择的接口去查询相关数据
            var parms = {
                id: this.saveId,
                url: url
            }
            this.$httpExt().get("auto/imitateReq", parms)
                .then((response) => {
                    if (response.succ) {
                        this.portArrs[index].data = response.result.realResp;
                        this.portArrs[index].rapData = response.result.rapResp;
                        this.portArrs[index].status = response.result.realRespStatus;
                        this.portArrs[index].diff = response.result.compareResult;
                        this.portArrs[index].reqParams = response.result.reqParams;
                        this.dataClassify(response.result.compareResult, this.portIds[index]);

                        if (status == 'each') this.eachgetResult(++index);
                    } else {
                        this.portArrs[index].status = "error"
                        if (status == 'each') this.eachgetResult(++index);
                        Notification.error({
                            title: '异常',
                            message: response.msg
                        });
                    }
                }, (response) => {
                    this.portArrs[index].status = "error"
                    if (status == 'each') this.eachgetResult(++index);
                    Notification.error({
                        title: '异常',
                        message: response.msg
                    });
                })
        },
        sendGetResult() {
            var id = this.portIds[this.currentIndex];
            var index = this.currentIndex;
            var url = this.portArrs[index].showUrl
            this.getResult(id, url, index)
        },
        getProts(data) {
            var that = this;
            for (var i = 0, leng = data.length; i < leng; i++) {   //一级下的module
                let item = data[i];
                if (item.children && item.children.length > 0) {
                    for (var j = 0, lengs = item.children.length; j < lengs; j++) {   //二级下的pages
                        let nape = item.children[j];
                        if (nape.children && nape.children.length > 0) {
                            for (var n = 0, le = nape.children.length; n < le; n++) {        //三极下的ports
                                let dep = nape.children[n];
                                var obj = {};
                                obj = {
                                    id: dep.id,
                                    status: "not",
                                    diff: "not",
                                    showUrl: dep.reqUrl || "",
                                    data: null,
                                    rapData: null,
                                    reqParams:null
                                };                       //存储右边的数据和状态  
                                that.portArrs.push(obj);
                                that.portIds.push(dep.id);
                            }
                        } else {
                            continue;
                        }
                    }
                } else {
                    continue;
                }
            }
            if (this.checked) {
                this.eachgetResult(0);
            } else {
                this.throttle = true;
            }
            that.treeDate = data;
        },
        eachgetResult(index) {
            if (this.portArrs && this.portArrs.length > 0 && index != this.portArrs.length) {
                var url = this.portArrs[index].showUrl
                this.getResult(this.portIds[index], url, index, "each")
            } else {
                this.throttle = true;
                return;
            }
        },
        checkNode(data, node, component) {
            if (this.currentNodeId.id != data.id && (data.reqUrl || (!data.children))) {
                let index = this.portIds.indexOf(data.id);
                this.currentIndex = index;
                if (this.currentNodeId.vNode){
                    this.currentNodeId.vNode.$el.style.cssText = "background-color:none;";
                }
                component.$el.style.cssText = "background-color:#ccc;"
                this.currentNodeId.id = data.id;     //记录当前选中的id
                this.currentNodeId.vNode = component;   //记录当前选中的组件
            }
        },
        renderContent(h, { node, data, store }) {
            if (data.reqUrl || (!data.children)) {
                /*jsx 语法*/
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                        <span class="el-tree-node__content_float_right">
                            <i v-show={this.portArrs[this.portIds.indexOf(data.id)].diff == 'Succ'} class="el-icon-circle-check" style="color:#42b983;"></i>
                            <i v-show={this.portArrs[this.portIds.indexOf(data.id)].diff == 'Warning'} class="el-icon-warning" style="color:#DAA520"></i>
                            <i v-show={this.portArrs[this.portIds.indexOf(data.id)].diff == 'Fail'} class="el-icon-circle-close" style="color:Chocolate;"></i>
                        </span>
                    </span>);
            } else {
                return (
                    <span>
                        <span>
                            <span>{node.label}</span>
                        </span>
                    </span>);
            }

        },
        resetAttribute() {                 //重新搜索  重置值
            if (this.currentNodeId.vNode)
                this.currentNodeId.vNode.$el.style.cssText = "background-color:none;";
            this.currentIndex = -1;
            this.currentNodeId = {
                id: -1,
                vNode: null
            }
            this.portArrs = [];
            this.portIds = [];
            this.treeDate = [];
            this.succPort = [];
            this.failPort = [];
            this.warningPort = [];
        }

    }
}
</script>
<style lang="less" >
@commonwid: 120px;
// //滚动条样式初始化
.scrollBarReset::-webkit-scrollbar-track,
pre::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
    background-color: #F5F5F5;
    border-radius: 6px;
}

.scrollBarReset::-webkit-scrollbar,
pre::-webkit-scrollbar {
    width: 6px;
    background-color: #F5F5F5;
}

.scrollBarReset::-webkit-scrollbar-thumb,
pre::-webkit-scrollbar-thumb {
    border-radius: 6px;
    background-color: #FFF;
    background-image: -webkit-gradient(linear,
    40% 0%,
    75% 84%,
    from(#20a0ff),
    to( #87CEFA),
    color-stop(.6, #1E90FF))
} //公共样式
.ri {
    float: right;
}

.le {
    float: left;
}

//清除浮动
.clearfix:after {
    clear: both;
}

.clearfix:before,
.clearfix:after {
    content: " ";
    display: table;
}

//重置tree的样式
.el-tree {
    border: none !important;
}

.user-not-select-id {
    height: 100%;
    font-size: 32px;
    text-align: center;
    line-height: 1;
    position: absolute;
    top: 500px;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    color: #888;
}

.user-select-png {
    position: absolute;
    top: 100px;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 100%;

    .legend {
        margin: auto;
        padding-right: 60px;
        margin-top: 100px;
        line-height: 20px;
        text-align: right;
        .legent-succ {
            .legent-cicle {
                background-color: #3797DC;
            }
        }
        .legent-fail {
            .legent-cicle {
                background-color: #B22222;
            }
        }
        .legent-warning {
            .legent-cicle {
                background-color: #DAA520;
            }
        }
        .legent-text {
            display: inline-block;
        }
        .legent-cicle {
            vertical-align: middle;
            display: inline-block;
            width: 18px;
            height: 18px;
            border-radius: 50%;
        }
    }
    .user-select-container {
        width: 100%;
        margin: auto;
        text-align: center;

        .percentage {
            .succ {
                .percentage-childer {
                    background-color: #3797DC;
                }
            }
            .fail {
                .percentage-childer {
                    background-color: #B22222;
                }
            }
            .warning {
                .percentage-childer {
                    background-color: #DAA520;
                }
            }
            .percentage-list {
                position: relative;
                height: 270px;
                margin: 0 40px;
                display: inline-block;

                .percentage-top {
                    background-color: #dfdfdf;
                    position: relative;
                    height: 30px;
                    width: @commonwid;
                    border-radius: ~"100px/30px";
                }

                .percentage-bottom {
                    background-color: #b7b7b7;
                    cursor: pointer;
                    opacity: 0.1;
                    z-index: 99;
                    width: @commonwid;
                    margin-top: -30px;
                    position: relative;
                    border-radius: ~"100px/30px";
                    height: 270px;
                }

                .percentage-childer {
                    position: absolute;
                    bottom: 0;
                    border-radius: ~"100px/30px";
                    width: @commonwid;
                    transition: height 0.5s;
                    .percentage-text {
                        position: absolute;
                        text-align: center;
                        z-index: 103;
                        width: @commonwid;
                        top: -16px;
                        color: #000;
                    }

                    .percentage-content {
                        position: relative;
                        width: @commonwid;
                        border-radius: ~"100px/30px";
                        height: 30px;
                    }
                }
            }
        }
    }
}


.repContainer {
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    overflow-x: hidden;
    padding-top: 16px;
    padding-left: 10px;
    .form-height {
        height: 50px;
        line-height: 50px;
        vertical-align: middle;
        display: table-cell;
    }
    .rep-id {
        width: 300px;
    }
    .check-style {
        margin-left: 30px;
    }
    .content {
        margin-top: 20px;
        height: auto;
        min-height: 100px;
        border: 1px solid #ccc;

        .tree-content {
            padding-top: 10px;
            height: 700px;
            overflow: auto;
            border-right: 1px solid #ccc;
        }
        .empty-data {
            text-align: center;
            line-height: 200px;
            color: LightSteelBlue;
            font-size: 22px;
        }
        .active-result {
            padding-top: 10px;
            padding-right: 20px;
            .result-header {
                height: 50px;
                line-height: 50px;
                .result-status {
                    margin-right: 10px;
                    margin-left: 25px;
                }
            }
            .result-data {
                width: 100%;
                border: 1px solid #ccc;
                 &.query{
                     margin-bottom:20px;
                     .result-content{
                         height: 200px;
                     }
                 }
                .result-content {
                    height: 400px;
                    overflow: auto;
                }
            }
            .matching-content {
                width: 100%;
                margin-top: 20px;
                border: 1px solid #ccc;
                .matching-data {
                    height: 350px;
                    width: 100%;
                    overflow: auto;
                }
            }
            .fw {
                font-weight: 600;
            }
            .result-data-txt {
                height: 32px;
                font-size: 16px;
                line-height: 32px;
                background-color: #324057;

                .empty-result {
                    margin-right: 12px;
                    cursor: pointer;
                }
                span {
                    color: #fff;
                    padding-left: 10px;
                }
            }
        }
        /*tree第一层节点*/
        .el-tree-node__content {
            position: relative;
            .el-tree-node__content_float_right {
                position: absolute;
                right: 18px;
            }
        }

        .tree-content>div.el-tree>div.el-tree-node>div.el-tree-node__content {

            .el-tree-node__label {
                font-size: 20px;
            }
        }
        /*tree第二层节点*/
        .tree-content>div.el-tree>div.el-tree-node>div.el-tree-node__children>div.el-tree-node>div.el-tree-node__content {
            .el-tree-node__label {
                font-size: 18px;
            }
        }
        /*高亮节点*/
        .el-tree--highlight-active {
            background-color: LightGrey;
        }


        /*去除jsonview边框样式*/
        .jsoneditor.jsoneditor-mode-view {
            border: none;
        }
    }
}
</style>