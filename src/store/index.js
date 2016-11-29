import Vue from 'vue'
import Vuex from 'vuex'
import createLogger from 'vuex/dist/logger'
//import * as actions from './actions'
//import * as getters from './getters'
import message from './modules/message'
import self from './modules/self'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
 // actions,
 // getters,
  modules: {
    message,
    self
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})