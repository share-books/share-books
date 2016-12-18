//src/store/modules/cache.js
//@flow

import Vue from 'vue'


import AppCfg from '../../../config/app'
import api from '../../api'
import {ObjIntPropKeys2Array} from '../../util'
import * as types from '../mutation-types'


let FIFO = []// 先进先出队列
let pending={}


const items: { [id: number]: Item } = {}
const users: { [uid: string]: User } = {}


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

async function loadData ({ commit, state}, id){
    //if (api.debug)
   //     console.log('load data from cache :', id)
    let key = `${id}`
    let topic='item/'
    let type=types.ADD_ITEM_TO_CACHE
    let record =null
    let isUser = !(/^[0-9]*$/.test(key))
    if (isUser){
      topic='user/'
      type=types.ADD_USER_TO_CACHE
      record =state.users[id]
    }
    else{
      record =state.items[id]
    }
       
   
    if (!record) {
       let cnt=0
       while (!!pending[key]&&cnt<10){
          cnt++
          if (api.debug)
             console.log('sleep ',cnt,key)
          await sleep(100)
         
      }
      if (cnt==0||cnt==10){
          pending[key]=true
          record = await api.fetch(topic+key)
          commit(type, { record })
          pending[key]=false
      }else{
          if (api.debug)
             console.log('hit:', key)
          record=getCacheData(isUser,state,id)
          if (!record) {
            record = await api.fetch(topic+key)
            commit(type, { record })
          }

     }
   } else {
      if (api.debug)
        console.log('hit:', key)
   }
   return record
 }
function getCacheData (isUser,state, id){
   let record=null
   if (isUser)
      record =state.users[id]
   else
      record =state.items[id]
   return record
}
const actions = {
  query : async function  ({ dispatch}, {keys,ids}){
    let keywords=keys.split(' ')
    let books=[]
  //  console.log(ids)
    for (let i=0;i<ids.length;i++){
        let id=ids[i]
        let item=await dispatch('loadItem', id)
        let flag=true
       // console.log(item.keywords)
        for (let i=0;i<keywords.length;i++){
           flag=flag&&String(item.keywords).indexOf(keywords[i])>-1
           //console.log(keywords[i],flag)
           if(!flag)
              break
        }
        if(flag) books.push(item)
       
    }
    return books
  },

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
    let uid = !item.uid? api.curUser().uid:item.uid
    let user = await dispatch('loadUser', uid)
    item.uid = uid
   // item.by = user.displayName
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
    return await loadData({ commit, state}, id)
  },


  loadUser: async ({ commit, state}, uid) => {
    return await loadData({ commit, state}, uid)
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
  [types.ADD_ITEM_TO_CACHE]: (state, {record}) => {
    if (!record)
      return
    if (api.debug)
      console.log('ADD_ITEM_TO_CACHE', record.title)
    Vue.set(state.items, record.id, record)//确保其他依赖观察者同步
    FIFO.push(record)

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

  [types.ADD_USER_TO_CACHE]: (state, {  record }) => {
    if (!record)
      return
    if (api.debug){
      //console.log('ADD_USER_TO_CACHE', user.uid)
      console.log('ADD_USER_TO_CACHE', record.displayName)

    }
      
    Vue.set(state.users, record.uid, record)//确保其他依赖观察者同步

    FIFO.push(record)
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

