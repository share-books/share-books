import Vue from 'vue'
//import router from './router'
import App from './App.vue'
//import filter from './utils/filter'

//window.jQuery = window.$ = require('../static/js/jquery.filer.min.js')
//import 'imports?$=jquery!../static/js/jquery.filer.min.js'
//let jqueryfiler=require('../static/js/jquery.filer.min.js')
// setup Vue filter
//filter(Vue)

// whether to allow vue-devtools inspection
// false in production builds
Vue.config.devtools = process.env.NODE_ENV !== 'production'
//python -m SimpleHTTPServer 8080
// create the app instance and mount to #app
const app = new Vue(
  Vue.util.extend({  }, App)//router
).$mount('#app')

export { app }//, router