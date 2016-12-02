import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
//import * as actions from './actions'
//import * as getters from './getters'
//import message from './modules/message'
//import self from './modules/self'
import cache from './modules/cache'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
 // actions,
 // getters,
  modules: {
   // message,
   // list,
    cache
  },
  strict: debug,
  plugins: []//debug ? [createLogger()] : []
})