 var sfgather = {}
 sfgather.install = function(vue) {
     /**
      * 框架引入了大数据平台的SfGather-js的sdk进行数据埋点
      * SfGather-js是一款基于开源产品countly-sdk-web开发的用户行为收集SDK，功能包括通用自定义事件上报、追踪session、记录访问页面信息、
      * 自动记录所有点击事件、记录点击links事件、记录页面提交表单数据、记录页面中errors事件信息等，后台对接大数据平台。
      * 相关平台人员：张悦（01370853）徐芾清(01369308)
      * 框架使用的异步接入方式（Asynchronous）
      * 针对框架使用进行了简单的封装
      * 
      * 自动采集页面浏览pv：只要浏览当前的url发生变更（包括hash变化）即可收集到，否则需要手动记录，如改变页面内内嵌的页面就监听不到
      *
      */

     window.SfGather = window.SfGather || {};
     SfGather.q = SfGather.q || [];
     /**
      * 是否开启debug模式  
      * 可以在控制台输出相应的数据
      * 生产可以设置为false
      */
     SfGather.debug = true;
     /**
      * 相应的生产地址和测试环境地址
      */
     SfGather.url = "http://218.17.248.243:40021/json_data"
         // SfGather.url = "https://inc-ubas-web.sf-express.com/json_data"
         /**
          * 注册应用时生成的appId,必传字段  请联系徐芾清(01369308)申请注册  
          */
     SfGather.app_id = "sfopen";
     /**
      * 运行的操作平台
      */
     SfGather.platform = "mobile"; //平台类型
     /**
      * 获取埋点初始化数据
      */
     var obj = {};
     new Promise((resolve) => {
             if (process.env.NODE_ENV !== "development") {
                 try {
                     document.addEventListener('deviceready', () => {
                         if (window.cordova && window.ExpressPlugin) {
                             ExpressPlugin.getCountlyInfos(function(jsonStr) {
                                 var data = jsonStr ? JSON.parse(jsonStr) : undefined;
                                 SfGather.uid = data ? data.account : ""; //用户工号
                                 obj.equipment_type = data ? data.equipment_type : ""; //设备型号
                                 obj.system = data ? data.system : ""; //操作系统
                                 obj.app_version = data ? data.app_version : ""; //丰声版本号
                                 resolve();
                             }, function() {
                                 SfGather.uid = "0"; //用户id
                                 resolve();
                             });
                         }
                     })
                 } catch (e) {
                     SfGather.uid = "0";
                     resolve();
                 }
             } else {
                 SfGather.uid = "0"; //用户id
                 resolve();
             }
         })
         .then(() => {
             (function() {
                 var cly = document.createElement('script');
                 cly.type = 'text/javascript';
                 cly.async = true;
                 cly.src = './static/SfGather.min.js';
                 cly.onload = function() {
                     SfGather.init();
                 };
                 var s = document.getElementsByTagName('script')[0];
                 s.parentNode.insertBefore(cly, s);
             })();
             vue.prototype.$sfgather = function() {
                 return {
                     /**
                      * 手动自定义事件上报 
                      * @param {*} event_id  用于标记事件类型，如：view_page、click、login_in等，未指定时默认view_page
                      * @param {*} segmentation event_id外其他业务数据将打包为properties对象上报后台。
                      */
                     addUserEvent(event_id, segmentation) { //通用自定义事件上报  event_id为单次点击的id  segmentation为自定义字段
                         var infos = {
                             "event_id": event_id || "default_event"
                         };
                         var newInfos = Object.assign({}, obj, infos);
                         var segments = segmentation ? Object.assign(newInfos, segmentation) : newInfos;
                         SfGather.q.push(['add_event', segments])
                     },
                     /**
                      * 手动记录页面浏览pv
                      * 手动记录用户访问的页面。page为页面名称，不传时为location.pathname；ignoreList为忽略记录的页面列表，可选值
                      */
                     track_pageview(pageName) {
                         var page = pageName || (location.pathname + location.hash);
                         SfGather.q.push(['track_pageview', page]);
                     },
                     /**
                      * 手动记录点击事件
                      * 手动记录指定节点上所有点击事件。parent为指定的记录dom节点（document.getElementById('parent_id');），不传时为document；
                      * props为自定义字段，可选值。
                      * 在vue 中使用此方法  需要保证node节点加载完成
                      */
                     track_clicks(parent, props) {
                         var segments = props ? Object.assign({}, obj, props) : Object.assign({}, obj);
                         SfGather.q.push(['track_clicks', parent || document, segments]);
                     },
                     /**
                      * 手动记录点击links事件
                      * 记录整个页面或指定节点上所有点击links事件。parent为指定的记录dom节点，不传时为document。
                      */
                     track_links(parent) {
                         SfGather.q.push(['track_links', parent]);
                     },
                     /**
                      * 手动记录页面提交的表单数据
                      * 页面有表单数据提交时，自动上报event_id为formSubmit通用自定义事件。parent为指定的记录dom节点，不传时为document。
                      */
                     track_forms(parent) {
                         SfGather.q.push(['track_forms', parent]);
                     },
                     /**
                      * 
                      *  自动记录点击事件  
                      *     需要在标签中添加sftag属性，属性的值为自定义属性键值对（其中event_id默认为’click_auto’），以冒号(:)分隔key/value,以逗号(,)分隔多个key/value,
                      *     示例如下：<button sftag="event_id:id123456,key1:value1,key2:value2,key3:value3">自动化埋点</button>
                      */
                     /**
                      * 手动记录errors事件信息
                      * 记录自定义errors信息。segments为自定义上报字段，可选值。
                      */
                     track_errors(segments) {
                         var seg = segments ? Object.assign({}, obj, segments) : Object.assign({}, obj);
                         SfGather.q.push(['track_errors', seg]);
                     },
                     /**
                      * 设置用户信息  已经在admin/checkLogin的时候自动填写了uid（员工登陆工号）
                      * @param {*} uid  用户id 
                      * @param {*} sec_uid 用户三方登录uid
                      * @param {*} login_type 用户登录类型
                      */
                     setLoginInfo(uid, sec_uid, login_type) {
                         var uids = uid || 　SfGather.uid;
                         var sec_uids = sec_uid || null;
                         var login_types = login_type || null;
                         SfGather.set_login_info(uids, sec_uids, login_types);
                     },
                     /**
                      * 当需要立即上报数据，并在指定延迟时间内执行回调函数
                      * @author fanxing
                      * 同步构建数据，异步发送网络请求
                      * 直接发送数据到后台
                      * eventParams：json格式，事件参数
                      * callback：function,要执行的回调函数
                      * timeout: 毫秒, 超时时间
                      * 使用场景：页面跳转前，事件记录的重复和延迟问题
                      */
                     sendDataDirect(callback, eventParams, timeout) {
                         SfGather.sendDataDirect(callback, eventParams, timeout);
                     }
                 }
             }
         })
 }
 export default sfgather;