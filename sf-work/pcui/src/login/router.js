import Vue from 'vue'
import Router from 'vue-router';
import loginPage from './page/loginPage';
import forgetPage from './page/forgetPage';
import registerPage from './page/registerPage';

Vue.use(Router);

export default new Router({
	routes: [{
		path: '/forgetPage',
		component: forgetPage,
	}, {
		path: '/registerPage',
		component: registerPage,
	}, {
		path: '/loginPage',
		component: loginPage
	}, {
		path: '*',
		redirect: '/loginPage'
	}]
});