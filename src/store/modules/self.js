import * as types from '../mutation-types'
import Vue from 'vue'
import api from '../../api'
import appCfg from '../../../config/app'

const state = {
  authenticated:false,
  uid:null,
  email:'',
  city:'',
  displayName:'',
  myScore:0

}

// getters
const getters = {
  myScore:state => state.myScore,
  authenticated:state => state.authenticated,
  myId:state => state.uid,
  myCity:state => state.city,
  myName:state => state.displayName,
  myEmail:state =>state.email
}
async function updateScore(uid, delta) {
  return await api.transaction(`biz/user/${uid}`, delta)
}
// actions
const actions = {
   async loadMyScore({commit, dispatch,state }) {
    let uid=state.uid
    let score= await api.fetch(`biz/user/${uid}`)
    
    if (score==null){
      score=appCfg.BIZ.DEFAULT
      await updateScore(uid, score)
      console.log(score)
    }
     commit(types.SYNC_MY_SCORE,{score})
    return score
  },

  register ({commit},{mobile, pass}) {
     return api.createUser(mobile,pass)
  },
 async login ({commit,dispatch},{mobile, pass}) {
   await dispatch('beginLoad')
   let user=null
   try{
     user=await api.login(mobile,pass)
     await dispatch('afterLoad')
     commit(types.AUTH_LOGGEDIN,{user})
     let msg='欢迎你－－'+user.displayName
     await dispatch('notify',{type:'info',notify:msg})
     return user
   }catch(err){
     console.log(err)
     await dispatch('afterLoad')
     let msg='登录失败，请检查手机号或密码是否正确！'
     await   dispatch('notify',{type:'error',notify:msg})
     return null

   }
  
 },
 logout ({commit,dispatch,getters}) {
   dispatch('beginLoad')
   let name=getters.myName
   api.logout().then(()=>{
        dispatch('afterLoad')
        commit(types.AUTH_LOGOUT)
        dispatch('notify',{type:'info',notify:'再见，亲--'+name})
         
    }).catch(err=>{
        console.log(err)
        dispatch('afterLoad')
        commit(types.AUTH_LOGOUT)
    })
 },
 async updateProfile ({commit,dispatch,getters},{user}) {
   await dispatch('beginLoad')
    try{
      if (user.email!=getters.myEmail)
         await api.updateEmail(user.email)
      await api.updateProfile(user)
      commit(types.CHANGE_PROFILE,{user})
      dispatch('afterLoad')
      return true
    }catch(err){
      console.log(err)
      dispatch('afterLoad')
    }
    return false
  }
  

}
// mutations
const mutations = {
  [types.SYNC_MY_SCORE] (state,{score}) {
     state.myScore=score
     console.log('set score:',score)
  },
  [types.CHANGE_PROFILE] (state,{user}) {
     state.info=user||{}
  },
 [types.AUTH_LOGGEDIN] (state,{user}) {
     state.authenticated=true
     let {uid,email,displayName}=user
     state.uid=uid
     state.displayName=displayName
     state.email=email
     
  },
   [types.AUTH_LOGOUT] (state) {
     state.authenticated=false
     state.uid=null
     state.displayName=''

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
