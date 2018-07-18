import Vue from "vue";
import VueResource from "vue-resource";
import VueSocketio from "vue-socket.io";
import App from "./App.vue";

import { store } from "./store/store";

Vue.use(VueResource);
var url = "http://127.0.0.1:3000/";
Vue.use(VueSocketio, url); //这里的url是后台提供的socket的地址

Vue.use(VueVideoPlayer);

new Vue({
  el: "#app",
  store,
  render: h => h(App)
});
