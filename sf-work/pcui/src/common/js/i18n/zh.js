import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
module.exports = {
	appMes: {
		language: '中文',
		homePageLang: '首页',
		selectRole: '选择角色',
		quit: '退出', // quit
		quitTips: '退出提示', // tips
		quitContent: '你确定要退出吗', //  Are you sure you quit logon
		cancelOption: '取消',
		submitOption: '确定',
		selectRoles: '请选择角色',
		languageList: [{
				value: 'en',
				label: '英文'
			},
			{
				value: 'zh-CN',
				label: '中文'
			}
		]
	},
	roleLang: {
		roleTitle: '新增角色',
		roleCode: '角色编码',
		roleName: '角色名称',
		enroleName: '角色名称(en)',
		roleType: '角色类型',
		isEffective: '是否有效',
		effective: '有效',
		invalid: '无效',
		roleDescription: '角色描述',
		cancelOption: '取消',
		submitOption: '确定',
		pleaseChoose: '请选择',
		search: '查询',
		addOption: '新增',
		editOption: '修改',
		deleteOption: '删除',
		authority: '授权',
		closeOption: '关闭',
		saveOption: '保存',
		roleAuthority: '角色功能模块授权',
		editTime: '修改日期',
		state: '状态',
		selectOptions: '请选择一条进行操作!',
		deleteThisRole: '确定删除该角色吗',
		tips: '提示',
		deleteSucc: '删除成功',
		saveSucc: '保存成功',
		operateSucc: '操作成功',
		authoritySucc: '授权成功',

		roleChartset: '请输入角色编码',
		inputTest: '只能填写[数字、大小写字母、下划线],且长度在30个字符内',
		inputRoleName: '请输入角色名称',
		roleNameLimit: '角色名称最多50个字符',
		chooseRoleType: '请选择角色类型',
		chooseIsavaild: '请选择是否有效',

	},
	userListLang: {
		userTitle: '新增用户',
		userType: '用户类型',
		domain: '域用户账号',
		Ndomain: '非域用户账号',
		inusername: '用户名称',
		eninusername: '用户名称(EN)',
		placeholderTipOne: '6位或8位用户工号', //6位或8位用户工号':'48位以内字符
		placeholderTipTwo: '48位以内字符',
		inPwd: '密码',
		cancelOption: '取消',
		submitOption: '确定',
		saveOption: '保存',
		testPwdOne: '请输入密码',
		testPwdTwo: '密码不能设置有空格',
		testPwdThere: '密码必须有小写字母',
		testPwdFour: '密码必须有大写字母',
		testPwdFive: '密码必须有数字',
		testPwdSix: "密码必须有特殊字符!\"#$%&'()*+,-./:;<=>?@[\]^_`{|}~",
		testPwdSeven: '密码长度必须介于[6-24]个字符',
		userAuthority: '用户授权',
		userAuthorityName: '名称',
		userAuthorityType: '类型',
		userAuthorityRoleName: '角色名称',
		userAuthorityDefault: '默认', //period of validity
		userAuthorityValidity: '有效期',
		selectDate: '选择日期',
		pleaseChoose: '请选择',
		effective: '有效',
		invalid: '无效',
		state: '状态',
		search: '查询',
		addOption: '新增',
		deleteOption: '删除',
		authority: '授权',
		deleteRole: '删除角色',
		startOpen: '启用',
		stopUse: '停用',
		hasRoles: '已有角色',
		activationTime: '激活日期',
		stopDTime: '停用日期',
		modifiedBy: '修改人',
		modifiedTime: '修改时间',
		createBy: '创建人',
		createTime: '创建时间',
		deleteThisRole: '确定删除该用户吗',
		deleteAllRole: '确定删除所有用户吗',
		tips: '提示',
		deleteSucc: '删除成功',
		saveSucc: '保存成功',
		selectOptions: '请选择一条进行操作!',
		userStateStart: '该用户已为启用状态！',
		userStateStop: '该用户已为停用状态！',
		existRole: '已经存在了',
		playRole: '角色',

		chooseType: '请选择角色类型',
	},
	dataDictionaryLang: {
		dicTitle: '新增数据字典',
		dicKey: '字典key',
		endicKey: '字典key(英文)',
		placeholderKey: '字典key',
		dcname: '名称',
		placeholderDcname: '名称',
		endcname: '英文名称',
		placeholdereEndcname: '英文名称',
		dicValue: '值',
		sequenceNum: '顺序号',
		isEffective: '是否有效',
		effective: '有效',
		invalid: '无效',
		description: '描叙',
		search: '查询',
		addOption: '新增',
		editOption: '修改',
		deleteOption: '删除',
		cancelOption: '取消',
		submitOption: '确定',
		state: '状态',
		createTime: '创建日期',
		editTime: '修改日期',

		requestFail: '服务器请求失败,请重试',
		selectOptions: '请选择一条进行操作!',
		tips: '提示',
		deleteSucc: '删除成功',
		saveSucc: '保存成功',
		deleteThisRole: '确定删除吗',
		childNode: '当前节点下有子节点,不能删除,请先删除子节点',
		cancelDelete: '取消删除',
	},
	functionListLang: {
		functionModule: '功能模块管理', //Function module management 
		moduleName: '名称', //name
		moduleCharset: '编码', // charset
		iconStyle: '图标样式', //icon style
		moduleModel: '模块模型', //module model
		menuList: '菜单目录', //menu list
		pageButton: '页面按钮', //page button
		childSystem: '子系统', //child system
		isHide: '是否隐藏', //hide or not
		hide: '是', // 'yes'
		nHide: '否', //no
		systemCharset: '系统编码', // system charset
		functionType: '功能类型', //function type
		sequenceNum: '顺序号', //sequence number
		functionUrl: '功能URL', //function Url
		description: '描述', //description
		saveModule: '保存', //save
		saveFunctionModule: '保存功能模块', // save function module
		savaSucc: '保存成功', // save success
		cancelModule: '取消', //cancel
		submieModule: '确定', //submit
		sequenceNumLimit: '请填写顺序号', // please enter sequence number
		sequenceNumType: '顺序号必须为数字值', // sequence must be number
		moduleNameTest: '请输入模块名称', // please enter module name
		moduleNameLimit: '长度在 3 到 15 个字符', //length limit in [3-15]
		moduleCharsetTest: '请输入模块编码', // please enter module charset
		isHideTest: '请选择是否隐藏', // please choose hide or not
		moduleSysCharset: '请填写系统编码', // please enter system charset
		requestFail: '服务器请求失败,请重试',
	},
	homePageLang: {
		homeTitle: '欢迎使用sfopen框架',
		homeDescription: '进入到此页面说明前端框架已经部署成功',
		severLearn: '如果你是后端开发人员，请进入平台学习',
		pcLearn: '如果你是用于开发PC端应用，请参考',
		phoneLearn: '如果你是用于开发移动端端应用，请参考',
		severDoc: '后端在线文档',
		pcDoc: 'PC端在线文档',
		phoneDoc: '移动端在线文档',
	},
	staticResourceLang: {
		currentNameSpace: '当前命名空间', //Current namespace
		Nchoice: '暂无选择', //No choice for the time being
		NchooseSpace: '您还没有选择任何命名空间目录', //You have not yet selected any namespace directory
		addNode: '新增模块节点', //New module node 
		editNode: '修改模块节点',
		nodeName: '节点名称', //node name
		cancelModule: '取消', //cancel
		submieModule: '确定', //submit
		chooseStaticRes: '选择静态资源文件', //Select the static resource file
		uploading: '上传中', // uploading
		docPreview: '文件预览列表', //File preview list
		uploadTypeOne: '将文件拖到此处，或', // Drag the file here, or
		uploadTypeTwo: '点击上传', // click upload
		docUploadStyle: '选择单模块或者多模块的静态资源文件zip压缩包上传', //Select single module or multi module static resource file zip compression packet Uploaded
		docUploading: '文件上传中', // file uploading
		previewList: '预览列表', //preview list
		copyLink: '复制链接', // copy link
		Ndata: '暂无数据', // no data
		nameSpaceMenu: '命名空间文件目录：', // Namespace file directory:
		deleteMsg: '该节点下有子节点，执行删除操作将同时删除所有子节点，请确认是否删除', //Under this node, there are child nodes, and delete operations will delete all the child nodes at the same time. Please confirm whether to delete.
		deleteComfirm: '请确认是否进行删除操作', //  Please confirm whether the delete operation is performed
		deleteTips: '删除提示', //tips
		requestFail: '服务器请求失败,请重试',
		gotIt: '我知道了', //I got it
		completeImport: '导入完成', //The import is completed 
		inputNodeName: '请填写节点名称', //Please fill in the name of the node
	},
	rapCompareLang: {
		requesID: '请求标示', //reques ID
		requestAllinterface: '自动请求查询全部接口', //Automatic request query all interface 
		rapSearch: '查询', //search
		rapQuery: '查询中', // in the query
		severDeg: '后端需要开启Debug模式，否则无法获取后端数据', //The back end needs to open the Debug mode, otherwise the back end data will not be obtained
		state: '状态', // state
		succ: '成功', // success
		fail: '失败', //fail
		abnormal: '异常', //abnormal
		unrequested: '未请求', // unrequested
		request: '请求', // request
		requestAgain: '重新请求', // request again
		requestParams: '请求参数', // request params
		nData: '无数据', // no date
		responseResult: '请求结果', //request result
		matchSucc: '接口对比匹配成功', // Interface contrast matching success
		matchFail: '接口对比匹配失败', // Interface contrast matching fail
		matchAbnormal: '接口对比匹配异常', // Interface contrast matching abnormal
		searchRapId: '请搜索Rap对应接口的ID', // Please search the ID for the Rap corresponding interface
		clickinput: '点击了input框', //  Click the input box
	},
	userlogin:{
		loginTitle:'账号登录',
		photoNumber:'手机号',
		passWord:'密码',
		verifyCode:'验证码',
		loading:'加载中...',
		refresh:'刷新',
		signIn:'登录',
		register:'立即注册',
		forgotPassword:'忘记密码',
		scannedSecureLogin:'扫描安全登录',
		smsVerifyCode:'短信验证码',
		retypePassword:'确认密码',
		returnLogon:'返回登录',
		GettingSmsVerifyCode:'获取短信验证码',
		newPassword:'输入新密码',
		confirm:'确认',
		sfopen:'sfopen开源框架',
		turnClick:'请依次点击',
		inGetting:'获取中...',
		phoneNumberWrong:'请输入正确的手机号',
		captchaFailed:'验证码未通过验证',
		authenticationSuccess:'验证成功',
		authenticationFailure:'验证失败,请重试...'
	},
	...zhLocale
}