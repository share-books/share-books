import * as types from '../mutation-types'
//import * as bizMgr from '../../api'
//import * as userMgr from '../../api/userMgr'
const state = {
  loading: false,
  type:'info',
  notify:'＝＝＝请登录＝＝＝'
}

// getters
const getters = {
  loading: state => state.loading,
  notifyType: state => state.type,
  notifyMsg: state => state.notify
}

// actions
const actions = {
  beginLoad({commit}){
      commit(types.MSG_LOADING)
  },
  afterLoad({commit}){
      commit(types.MSG_LOADED)
  },
  notify({commit},appState){
    commit(types.MSG_NOTIFY,appState)
  }
}
// mutations
const mutations = {
 [types.MSG_LOADING] (state) {
     state.loading=true
     state.type = 'info'
     state.notify = '加载中...'
  },
  [types.MSG_LOADED] (state) {
     state.loading=false
     state.type = 'info'
     state.notify = ''
  },
  [types.MSG_NOTIFY] (state,{type,notify}) {
    state.type = type
    state.notify = notify
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
