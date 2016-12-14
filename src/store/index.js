import Vue from 'vue'
import Vuex from 'vuex'
//import createLogger from 'vuex/dist/logger'

import biz from './modules/biz'
import message from './modules/message'
import self from './modules/self'
import cache from './modules/cache'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export const msgBus=new Vue()

export default new Vuex.Store({
 // actions,
 // getters,
  modules: {
    biz,
    message,
    self,
    cache
  },
  strict: debug
  //plugins: debug ? [createLogger()] : []
})