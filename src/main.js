//import 'es6-promise/auto'
import Vue from 'vue'
import { mapGetters } from 'vuex'
import store from './store'
import router from './router'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import App from './App.vue'
import appCfg from '../config/app'

Vue.config.devtools = process.env.NODE_ENV !== 'production'
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
  computed:{
      ...mapGetters(['myId','authenticated']),
      staticRoot(){
          let rt=appCfg.PUBLIC_BASE
          console.log(rt)
          return rt
      }
  },
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