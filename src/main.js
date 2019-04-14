// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex'
import router from './router'
// 导入懒加载插件
import VueLazyLoad from 'vue-lazyload'
// 导入滚动加载数据插件
import infiniteScroll from 'vue-infinite-scroll'
Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueLazyLoad,{
//  设置图片还未加载出来时的图片样式
  loading:'/static/loading-svg/loading-bars.svg'
});
Vue.use(infiniteScroll);

const store = new Vuex.Store({
  state:{
    nickName:'',
    cartCount:0
  },
  mutations:{
    updateUserInfo(state, nickName){
      state.nickName = nickName;
    },
    updateCartCount(state, count){
      state.cartCount += count;
    },
    initCartCount(state, count){
      state.cartCount = count;
    }
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  //render: h => h(App),
  components: { App }
});//.$mount('#app')
