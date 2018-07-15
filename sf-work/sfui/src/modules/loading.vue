<template>
    <div class="loading-page">
        <div class="loading-wrap">
            <v-spinner type="crescent"></v-spinner>
            <div class="loading-tips">加载中...</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'loading',
    data() {
        return {}
    }
}
</script>

<style lang="less" scoped>
.loading-page{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 1000;
    overflow: hidden;
    // background-color: rgba(0, 0, 0, 0.5);
    .loading-wrap{
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 20px;
        border-radius: 10px;
        background-color: rgba(0, 0, 0, 0.5);
        .loading-tips{
            margin-top: 5px;
            color: #fff;
            font-size: 14px;
        }
    }
}
.sfmui-spinner.sfmui-spinner-bubbles{
    stroke: #fff!important;
    fill: #fff!important;
}
</style>

