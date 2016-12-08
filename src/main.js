//import 'es6-promise/auto'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import App from './App.vue'

sync(store, router)
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

Vue.mixin({
  computed:mapGetters(['myId']),
  methods:{
    itsMe(uid){
      //console.log(this.myId)
      //console.log(uid)
      return (!!this.myId)&&(!!uid)&&uid==this.myId
    }
  }
})
const app = new Vue(cfg)


app.$mount('#app')