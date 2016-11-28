import * as types from '../mutation-types'
import * as bizMgr from '../../api'

import * as userMgr from '../../api/userMgr'
const state = {
  loading: false,
  type:'info',
  notify:'＝＝＝请登录＝＝＝',
  me:{authenticated:false,info:{},books:[]}
}

// getters
const getters = {
  loading: state => state.loading,
  notifyType: state => state.type,
  notifyMsg: state => state.notify,
  authenticated:state => state.me.authenticated,
  me:state => state.me.info||{},
  mybooks:state => state.me.books||{}
}

// actions
const actions = {
  beginLoad({commit}){
      commit(types.APP_LOADING)
  },
  afterLoad({commit}){
      commit(types.APP_LOADED)
  },
  notify({commit},appState){
    commit(types.APP_NOTIFY,appState)
  },
  login ({commit},{mobile, pass,cb}) {
    //return new Promise((resolve, reject) => {
      userMgr.login(mobile,pass).then(user=>{
        commit(types.APP_LOGGEDIN,user)
       
        cb(user)
      }).catch(function (err) {
       commit(types.APP_NOTIFY,{type:'error',notify:'登录失败，请检查手机号或密码是否正确！'})
       console.log("login ERR",mobile)
       cb(null) 
    })
  },
 logout ({commit}) {
    userMgr.logout().then(()=>{
       commit(types.APP_LOGOUT)
    })
  },
  register ({commit},{mobile, pass}) {
     return userMgr.createUser(mobile,pass)
  },
  updateProfile ({commit,getters},user) { //todo Promise.all
    let self=getters.me
   /* if (self.phone!=user.phone)
        userMgr.updatePhone(user.phone)*/
    if (self.email!=user.email)
       userMgr.updateEmail(user.email)
    userMgr.updateProfile(user.displayName,user.photoURL)
    commit(types.CHANGE_PROFILE)
  },
  addItem ({commit,dispatch,getters},item) { //todo Promise.all
    let self=getters.me
    let p=item.parent||0
    bizMgr.addItem(item,p).then(()=>{
      dispatch('getMyBooks')
    })
  },
  getMyBooks({commit}) {
    bizMgr.getMyBooks().then(books=>{
     // console.log(books.length)
       commit(types.SET_MYBOOKS,{books})
    })
  }

}
// mutations
const mutations = {
  [types.SET_MYBOOKS] (state,{books}) {
     state.me.books=books
  },
  [types.CHANGE_PROFILE] (state,user) {
     state.me.info=user
  },
  [types.APP_LOADING] (state) {
     state.loading=true
     state.type = 'info'
     state.notify = '加载中...'
  },
  [types.APP_LOADED] (state) {
     state.loading=false
     state.type = 'info'
     state.notify = ''
  },
  [types.APP_NOTIFY] (state,{type,notify}) {
    state.type = type
    state.notify = notify
  },
 [types.APP_LOGGEDIN] (state,user) {
     state.me.authenticated=true
     state.me.info={phone:user.phone,
                    email:user.email,
                    displayName:user.displayName,
                    photoURL:user.photoURL,
                    uid:user.uid}
     state.type = 'info'
     state.notify = '欢迎您：'+user.displayName
     
    // console.log(state.me.info)
  },
   [types.APP_LOGOUT] (state,user) {
     state.me.authenticated=false
     state.me.info={}
     state.type = 'info'
     state.notify = '＝＝＝请登录＝＝＝'
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
