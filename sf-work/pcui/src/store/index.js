import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

import global from './global/'; 

module.exports = new Vuex.Store({
    modules: {
        global
    }
});
