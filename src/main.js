//import 'es6-promise/auto'
import Vue from 'vue'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import App from './App.vue'


// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
//Vue.util.extend(
let cfg={
  router,
  store,
  ...App
}
const app = new Vue(cfg)

sync(store, router)
app.$mount('#app')