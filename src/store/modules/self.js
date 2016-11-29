import * as types from '../mutation-types'
import * as bizMgr from '../../api'
import * as userMgr from '../../api/userMgr'
const state = {
  authenticated:false,
  info:{},
  myBookIds:[],
  myBooks:[]
}

// getters
const getters = {
  authenticated:state => state.authenticated,
  me:state => state.info,
  myBooks:state=> state.myBooks
}

// actions
const actions = {
  register ({commit},{mobile, pass}) {
     return userMgr.createUser(mobile,pass)
  },
  login ({commit,dispatch},{mobile, pass}) {
    dispatch('beginLoad')
    return new Promise((resolve) => {
      userMgr.login(mobile,pass).then(user=>{
        dispatch('afterLoad')
        commit(types.AUTH_LOGGEDIN,{user})
        resolve(user)
      }).catch(err=>{
        dispatch('afterLoad')
        let msg='登录失败，请检查手机号或密码是否正确！'
        dispatch('notify',{type:'error',notify:msg})
        //console.log("login ERR",mobile)
        resolve(null) // reject(null) 
      })
    })
 },
 logout ({commit,dispatch,getters}) {
   dispatch('beginLoad')
   let name=getters.me.displayName
   return new Promise((resolve) => {
      userMgr.logout().then(()=>{
        dispatch('afterLoad')
        commit(types.AUTH_LOGOUT)
        dispatch('notify',{type:'info',notify:'再见，亲--'+name})
        resolve('OK')
      }).catch(err=>{
        console.log(err)
        commit(types.AUTH_LOGOUT)
        //dispatch('afterLoad')
        resolve('FAIL')
      })
    })
 },
 updateProfile ({commit,getters},{user}) { //todo Promise.all
    let me=getters.me
   /* if (self.phone!=user.phone)
        userMgr.updatePhone(user.phone)*/
    if (me.email!=user.email)
       userMgr.updateEmail(user.email)
    userMgr.updateProfile(user.displayName,user.photoURL)
    commit(types.CHANGE_PROFILE,{user})
  },
  addItem ({commit,dispatch,getters},{item}) { //todo Promise.all
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
     state.myBooks=books||[]
  },
  [types.CHANGE_PROFILE] (state,{user}) {
     state.info=user||{}
  },
 [types.AUTH_LOGGEDIN] (state,{user}) {
     state.authenticated=true
     state.info={//...user
       phone:user.phone,
       email:user.email,
       displayName:user.displayName,
       photoURL:user.photoURL,
       uid:user.uid
      }
  },
   [types.AUTH_LOGOUT] (state) {
     state.authenticated=false
     state.info={}

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
