> 非框架开发人员建议从最新的release分支上拉取代码，以保证代码稳定性

# 基于vue和element UI构建的一套前端工程。
从需求分析、到功能设计、再功能开发前端都可以一条龙完成，完全与后端解耦。
按照以下步骤即可运行服务：
1、安装nodejs客户端(6.x版本)，可自行到nodeJs官网下载，或从此链接下载：
http://10.118.13.75/sfopen/%e5%b7%a5%e5%85%b7%e5%ae%89%e8%a3%85%e7%a8%8b%e5%ba%8f/node-v6.2.0-x64.msi

2、下载node_modules包，可自行在命令行输入npm install命令下载，也可从此链接下载：http://10.118.13.75/sfopen/%e5%b7%a5%e5%85%b7%e5%ae%89%e8%a3%85%e7%a8%8b%e5%ba%8f/node_modules.rar

3、在当前项目根目录的CMD命令行，输入npm run dev 命令即可运行项目


ps:
文档平台，可供参考：http://10.118.13.75/1

``` 命令介绍
# 安装命令（默认不需要安装）
npm install

#启动服务的命令 可以在浏览器打开localhost:8000浏览结果
npm run dev

#打包命令
#开发
npm run build
#SIT
npm run sit
#STG
npm run stg
#PRD
npm run prd
```