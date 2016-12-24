import * as types from '../mutation-types'
import Vue from 'vue'
import api from '../../api'
import appCfg from '../../../config/app'

const state = {
  authenticated: false,
  uid: null,
  info: {
    email: '',
    phone: '',
    city: '',
    displayName: ''
  },

  score: 0

}

// getters
const getters = {
  myScore: state => state.score,
  authenticated: state => state.authenticated,
  myId: state => state.uid,
  myInfo: state => state.info,
  curWilddogUser: state => api.curUser(),
}
async function updateScore(uid, delta) {
  return await api.transaction(`biz/user/${uid}`, delta)
}
// actions
const actions = {
  async loadMyScore({commit, dispatch, state }) {
    let uid = state.uid
    let score = await api.fetch(`biz/user/${uid}`)

    if (score == null) {
      score = appCfg.BIZ.DEFAULT
      await updateScore(uid, score)
      console.log(score)
    }
    commit(types.SYNC_MY_SCORE, { score })
    return score
  },

  register({commit}, {mobile, pass}) {
    return api.createUser(mobile, pass)
  },
  sendPasswordResetSms({commit}, mobile) {
    return api.sendPasswordResetSms(mobile)

  },
  confirmPasswordResetSms({commit}, {phone, code, newPassword}) {
    return api.confirmPasswordResetSms(phone, code, newPassword)
  },
  async login({commit, dispatch}, {code, pass}) {
    await dispatch('beginLoad')
    let user = null
    let fun = api.login
    let isMobile = true
    if (code.indexOf('@') > -1) {
      fun = api.loginByEmail
      isMobile = false
    }

    try {
      let u = await fun(code, pass)//关键资料存放在wilddog官方
      //console.log(u)
      user = await dispatch('loadUser', u.uid)//自己设定的附加资料
      user = { ...user }//避免直接修改cache模块的state成员！
      //Vue.set(user,'uid',u.uid)
      user.uid = u.uid
      if (u.phone && u.phone.length > 0)
        user.phone = u.phone
      if (u.email && u.email.length > 0)
        user.email = u.email
      await dispatch('afterLoad')
     
      commit(types.AUTH_LOGGEDIN, { user })
      await dispatch('loadMyScore')
      let msg = '欢迎你－－' + user.displayName
      await dispatch('notify', { type: 'info', notify: msg })
      return user
    } catch (err) {
      console.log(err)
      await dispatch('afterLoad')
      let msg = '登录失败，请检查手机号或密码是否正确！'
      if (!isMobile) msg = '登录失败，请检查电子邮件地址或密码是否正确！'
      await dispatch('notify', { type: 'error', notify: msg })
      return null

    }

  },

  logout({commit, dispatch, getters}) {
    dispatch('beginLoad')
    let name = String(getters.myInfo.displayName)
    api.logout().then(() => {
      dispatch('afterLoad')
      commit(types.AUTH_LOGOUT)
      dispatch('notify', { type: 'info', notify: '再见，亲--' + name })

    }).catch(err => {
      console.log(err)
      dispatch('afterLoad')
      commit(types.AUTH_LOGOUT)
    })
  },
  async updateProfile({commit, dispatch, getters}, {user}) {
    await dispatch('beginLoad')
    
    //console.log(getters.curWilddogUser)
    await api.updateProfile(user)
    commit(types.CHANGE_PROFILE, { user })
    try {
      if (user.email != getters.curWilddogUser.email)
        await api.updateEmail(user.email)
    } catch (err) {
      console.log(err)
    }
    try {
      if (user.phone != getters.curWilddogUser.phone)
        await api.updatePhone(user.phone)
      await dispatch('afterLoad')
    } catch (err) {
      console.log(err)
    }
    await dispatch('afterLoad')
   }
}
// mutations
const mutations = {
  [types.SYNC_MY_SCORE](state, {score}) {
    state.score = score
    console.log('set score:',score)
  },
  [types.CHANGE_PROFILE](state, {user}) {
    let {email, city, displayName} = user
    state.info = { email, city, displayName }

  },
  [types.AUTH_LOGGEDIN](state, {user}) {
    state.authenticated = true

    let {phone, city, email, displayName} = user
    state.uid = user.uid
    state.info = { email, phone, city, displayName }

  },
  [types.AUTH_LOGOUT](state) {
    state.authenticated = false
    state.uid = null
    state.score = 0
    state.info = { email: '', city: '', displayName: '' }

  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
