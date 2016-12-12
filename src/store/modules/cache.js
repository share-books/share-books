//src/store/modules/cache.js
//@flow

import Vue from 'vue'


import AppCfg from '../../../config/app'
import api from '../../api'
import {ObjIntPropKeys2Array} from '../../util'
import * as types from '../mutation-types'


let FIFO = []// 先进先出队列
let pending={}


//const items: { [id: number]: Item } = {}
//const users: { [uid: string]: User } = {}


const state = {
  items: {},
  users: {}
}
function remove(arr,item){
   if (arr.length) {
      const index = arr.indexOf(item)
      if (index > -1) {
        return arr.splice(index, 1)
      }
   }
}
async function fetchNextId(): number {
  return api.transaction('maxid', 1)
}
const sleep = (ms) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true);
    }, ms)
  })
}


const actions = {
  likeItem: async ({ commit, dispatch,state}, {uid,id}) => {
     let user = await dispatch('loadUser', uid)
     let item = await dispatch('loadItem', id)
     let voted= await api.fetch(`item/${id}/likes/${uid}`)
     if(!voted){
      await api.save(`item/${id}/likes/${uid}`, true)
      commit(types.SYNC_LIKES, { id,uid })
      let old= await api.fetch(`top-books/${id}`)
       await api.save(`top-books/${id}`,Number(old)+1 ) //todo : transcation
     }
   },

   updateItem: async ({ commit, dispatch,state}, item) => {
     let id=item.id
      await api.update(`item/${id}`, item)
      if (!!state.items[item.id]){
        commit(types.DEL_ITEM_FROM_CACHE, { item })
        await dispatch('loadItem', item.id)

      }

   },
  addItem: async ({ commit, dispatch}, item) => {
    if (api.debug)
      console.log('addItem--', item.title)
    let id=item.id = await fetchNextId()
    let uid = api.curUser().uid
    let user = await dispatch('loadUser', uid)
    item.uid = uid
    item.by = user.displayName
    item.time = Date.now()
    if (!item.type || item.type.trim() === '') {
      item.type = item.parent > 0 ? 'comment' : 'book'
      if (api.debug) console.log('type--', item.type)
    }
    let parent = item.parent

    await api.save(`item/${id}`, item)

    if (parent > 0) {
      let pk = `item/${parent}`
      if (api.debug) 
        console.log('save--', pk + `/kids/${id}`)
      await api.save(pk + `/kids/${id}`, true)
      commit(types.SYNC_KIDS, { pid: parent, id })
    }


    if ("book" === item.type) {
      if (api.debug) 
        console.log('save--', `new-books/${id}`)
      await api.save(`new-books/${id}`, true)
      
    }
    let key = item.type + `s/${id}`
    if (api.debug) 
      console.log('save--', `user/${uid}/` + key)
    await api.save(`user/${uid}/` + key, true)
    commit(types.SYNC_OWNED, { uid, key })
    let msg=item.type=='book'?'书':'评论'
    msg='加入新'+msg
    if (api.debug) 
      console.log('save--feed')
    await api.push(`feed/`, {uid,id,
                    event:msg,
                    time:Date.now()
                  })

    return item

  },
  loadItems: async ({ commit, dispatch}, ids) => {
    //let ids2 = ids.filter(id => !state.items[id])
    if (ids&&ids.length) {
      return await Promise.all(ids.map(id => dispatch('loadItem', id)))
    }
    return await Promise.resolve([])
    
  },
  loadItem: async ({ commit, state}, id) => {
    let key = `${id}`
   // console.log('load item for:', id)
    let item =state.items[id]
   
    if (!item) {
      let cnt=0
      while (!!pending[key]&&cnt<10){
          //
          await sleep(500)
         cnt++
      }
      if (cnt==0||cnt==10){
          pending[key]=true
         // if (api.debug)
          //   console.log('load item :', key)
          item = await api.fetch('item/'+key)
          commit(types.ADD_ITEM_TO_CACHE, { item})
          pending[key]=false
      }else{
          if (api.debug)
             console.log('hit item:', key)
          return item
      }
    } else {
      if (api.debug)
        console.log('hit item:', key)
    }
    return item
  },


  loadUser: async ({ commit,dispatch, state}, uid) => {
    let key = `${uid}`
   
    let user =state.users[uid]
    if (!user) {
      let cnt=0
         while (!!pending[key]&&cnt<10){
          console.log('sleep!')
          await sleep(500)
         cnt++
      }
      if (cnt==0||cnt==10){
          pending[key]=true
          if (api.debug)
             console.log('load user :', key)
          user = await api.fetch('user/'+key)
          commit(types.ADD_USER_TO_CACHE, {user })
          pending[key]=false
      }else{
         user =state.users[uid]
          if (api.debug)
             console.log('hit user:', user.displayName)
          return user
      }
    } else {
     
      if (api.debug)
        console.log('hit user:', user.displayName)
    }

   return user

  },
  async loadItemsByUser({ dispatch },{uid,type}){
    let user =await dispatch('loadUser',uid)
    if (!user){
      console.log('loadUser fail for:', uid)
      return []
    }
    let ids= user[type+'s']||{}
    let keys=ObjIntPropKeys2Array(ids)
    return await dispatch('loadItems',keys)
  },
  debug({ state }) {
    let len = FIFO.length
    console.log('FIFI have ' + len + ' items')
    let keys = Object.keys(state.users)
    console.log('cached users:' + keys.length)
    keys.forEach(e => {
      console.log('user :', state.users[e].displayName)
    })
    let keys2 = Object.keys(state.items)
    console.log('cached items:' + keys2.length)
    keys2.forEach(e => {
      console.log('item :', state.items[e].title)
    })

  }
}


let mutations = {
  [types.SYNC_KIDS]: (state, {pid, id}) => {
    let p = state.items[pid]
    let key=`${id}`
    if (!!p) {
      if (!p.kids)
        Vue.set(p, 'kids', {})
      Vue.set(p.kids,key ,true)   
    }
  },
  [types.SYNC_OWNED]: (state, {uid, key}) => {
    let user = state.users[uid]
    if (!!user) {
       let ds=key.split('/') //types,id
       if (!user[ds[0]])
        Vue.set(user, ds[0], {})
      Vue.set(user[ds[0]], ds[1],true)   
    }
    
  },
  [types.SYNC_LIKES]: (state, {uid, id}) => {
    let item = state.items[id]
    let key=`${uid}`
    if (!!item) {
      if (!item.likes)
        Vue.set(item, 'likes', {})
      Vue.set(item.likes,key ,true)   
    }
  },
  [types.DEL_ITEM_FROM_CACHE]: (state, {item}) => {
     remove(FIFO,item)
     Vue.delete(state.items, item.id)
  },
  [types.DEL_USER_FROM_CACHE]: (state, {user}) => {
     remove(FIFO,user)
     Vue.delete(state.users, user.uid)
  },
  [types.ADD_ITEM_TO_CACHE]: (state, {item}) => {
    if (!item)
      return
    if (api.debug)
      console.log('ADD_ITEM_TO_CACHE', item.title)
    Vue.set(state.items, item.id, item)//确保其他依赖观察者同步
    FIFO.push(item)

    if (FIFO.length > AppCfg.CACHE.MAX_RECORDS) {
      let item = FIFO.shift()
      if (!item.id) {
        if (api.debug)
          console.log('RM_USER_FROM_CACHE', item.displayName)
        Vue.delete(state.users, item.uid)

      } else {
        if (api.debug)
          console.log('RM_ITEM_FROM_CACHE', item.title)
        Vue.delete(state.items, item.id)
     }
    }
  },

  [types.ADD_USER_TO_CACHE]: (state, {  user }) => {
    if (!user)
      return
    if (api.debug){
      //console.log('ADD_USER_TO_CACHE', user.uid)
      console.log('ADD_USER_TO_CACHE', user.displayName)

    }
      
    Vue.set(state.users, user.uid, user)//确保其他依赖观察者同步

    FIFO.push(user)
    if (FIFO.length > AppCfg.CACHE.MAX_RECORDS) {
      let item = FIFO.shift()
      if (!item.id) {
         if (api.debug)
          console.log('RM_USER_FROM_CACHE', item.displayName)

        Vue.delete(state.users, item.uid)
      }
      else{
       if (api.debug)
          console.log('RM_ITEM_FROM_CACHE', item.title)
        Vue.delete(state.items, item.id)
      }
    }

  }


}

let getters = {

  items: state => state.items,
  users: state => state.users

}

export default {
  state,
//  getters,
  actions,
  mutations
}

