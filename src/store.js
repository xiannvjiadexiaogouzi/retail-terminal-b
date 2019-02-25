import Vue from 'vue'
import Vuex from 'vuex'
import indexMenu from './assets/json/Indexmenu.json'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    //顶部导航
    nowNav: 'index',
    nowNavIndex: '',
    //侧栏导航
    nowMenuName: '',
    //用户信息
    user: localStorage.getItem('user') || {},
  },
  mutations: {
    CHANGE_STATE(state, payload) {
      // console.log('store');
      state[payload.name] = payload.data;
      // console.log(state[payload.name])
    },
    SET_USER(state, userInfo) {
      state.user = userInfo;
      localStorage.setItem('user', userInfo);
    },
    CLEAR_USER(state) {
      state.user = '';
    },

  },
  getters: {
    getUserInfo: state => state.user,
    activeMenu: state => state.nowMenuName,
    activeNav(state) {
      let a = 0;
      let flag = false
      indexMenu.forEach((el, index) => {
        for (let i in el) {
          if (flag) {
            break
          } else if (el[i] == state.nowNav) {
            a = index;
            flag = true
            break
          }
        }
      });
      return a
    },
  },
  actions: {

  }
})