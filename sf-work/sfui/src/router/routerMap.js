let routes = [
	{
	    path: "/match",
	    // name: "match",
	    component: (resolve) => require(["./../modules/match/match"], resolve),
	    meta: {
	        title: "赛事"
		},
		children: [
			{
				path: '/',
				redirect: '/match/matchHot'
			},
			{
				path: '/match/matchHot',
				name: 'matchHot',
				component: (resolve) => require(["./../modules/match/matchHot"], resolve)
			},
			{
				path: '/match/matchNew',
				name: 'matchNew',
				component: (resolve) => require(["./../modules/match/matchNew"], resolve)
			},
			
			
			
		]
	},
	{
		path: '/match/matchDetail/:uuid',
		name: 'matchDetail',
		component: (resolve) => require(["./../modules/match/matchDetail"], resolve)

	},
	{
		path: '/community/communityDetail/:uuid',
		name: 'communityDetail',
		component: (resolve) => require(["./../modules/community/communityDetail"], resolve)

	},
	
	{
		path: '/matchRule',
		name: 'matchRule',
		component: (resolve) => require(["./../modules/match/matchRule"], resolve)
	},
	{
		path: '/apply',
		name: 'apply',
		component: (resolve) => require(["./../modules/apply"], resolve)
	},
	{
		path: '/audition',
		name: 'audition',
		component: (resolve) => require(["./../modules/audition"], resolve)
	},
	{
		path: '/publishPost',
		name: '/publishPost',
		component: (resolve) => require(["./../modules/publishPost"], resolve)
	},
	{
		path: '/publishManifesto',
		name: '/publishManifesto',
		component: (resolve) => require(["./../modules/publishManifesto"], resolve)
	},
	{
		path: '/message',
		name: '/message',
		component: (resolve) => require(["./../modules/message"], resolve)
	},
	{
	    path: "/community",
	    // name: "community",
	    component: (resolve) => require(["./../modules/community/community"], resolve),
	    meta: {
	        title: "社区"
		},
		children: [
			{
				path: '',
				redirect: '/community/communityHot'
			},
			{
				path: '/community/communityHot',
				name: 'communityHot',
				component: (resolve) => require(["./../modules/community/communityHot"], resolve)
			},
			{
				path: '/community/communityNew',
				name: 'communityNew',
				component: (resolve) => require(["./../modules/community/communityNew"], resolve)
			},
			
			
			
		]
	},
	{
	    path: "/rank",
	    name: "rank",
	    component: (resolve) => require(["./../modules/rank/rank"], resolve),
	    meta: {
	        title: "排行"
	    }
	},
	{
	    path: "/user",
	    name: "user",
	    component: (resolve) => require(["./../modules/user/user"], resolve),
	    meta: {
	        title: "我的"
	    }
	},
]

routes.push({
    path: '/',
    redirect: '/match'
}, {
    path: '*',
    redirect: '/'
});

export default routes;