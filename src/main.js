import Vue from "vue";
import App from "./App.vue";
// import i18n from './i18n'
// import Vuex from 'vuex'

Vue.config.productionTip = false;
// Vue.use(Vuex)
new Vue({
  // i18n,
  // store,
  render: h => h(App)
}).$mount("#app");
