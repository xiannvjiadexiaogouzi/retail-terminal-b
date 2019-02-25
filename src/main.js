import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Element from 'element-ui';
import axios from 'axios';

import '@/assets/css/reset.css';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/scss/index.scss';

Vue.use(Element);

Vue.prototype.$axios = axios;

Vue.config.productionTip = false

// 全局路由守卫, 拦截重新登录
//* 一定要放在new Vue实例前面。否则没用
router.beforeEach((to, from, next) => {
  // console.log(JSON.stringify(store.state.user));
  // 判断vuex或localstorage中是否存在用户信息
  //* store.state.user即使为空也会有隐藏内容，会被判定为非空
  //* 判定json内容==='{}'
  if (JSON.stringify(store.state.user) === '{}') { //不存在用户信息
    if (to.name === 'login') {
      next();
    } else { //拦截并专跳login页面
      next({
        name: 'login'
      });
    }
  } else {
    //传给vuex
    //顶层nav
    store.commit("CHANGE_STATE", {
      name: "nowNav",
      data: to.path.split('/')[1]
    });
    //侧面menu
    store.commit("CHANGE_STATE", {
      name: "nowMenuName",
      data: to.path.split('/')[2]
    });
    next();
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')