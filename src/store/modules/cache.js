//src/store/modules/cache.js
//@flow

import Vue from 'vue'


import AppCfg from '../../../config/app'
import api from '../../api'
import * as types from '../mutation-types'


let FIFO = []// 先进先出队列



const items: { [id: number]: Item } = {}
const users: { [uid: string]: User } = {}


const state = {
  items: items,
  users: users,

 
}
async function fetchNextId(): number {
  return api.transaction('maxid', 1)

}



const actions = {
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
    }
    let parent = item.parent

    await api.save(`item/${id}`, item)
    //commit(types.ADD_ITEM_TO_CACHE, { item })
    if (parent > 0) {
      let p = await dispatch('loadItem', parent)
      let kids = !p.kids ? [] : [...p.kids]
      kids.unshift(id)
      let pk = `item/${parent}`
      await api.save(pk + '/kids', kids)
      commit(types.SYNC_KIDS, { id: parent, kids })
      //commit update kids
    }


    if ("book" === item.type) {
      let data = await api.fetch('new-books')
      data = !data ? [] : [...data]
      data.unshift(id)
      await api.save('new-books', data)
      
    }
    let key = item.type + 's'
    let ids = !user[key] ? [] : [...user[key]]
    ids.unshift(id)
    await api.save(`user/${uid}/` + key, ids)
    commit(types.SYNC_OWNED, { uid, key, ids })
    let msg=item.type=='book'?'书':'评论'
    msg='加入新'+msg
    await api.push(`feed/`, {uid,id,
                    event:msg
                  })

    return item

  },
  loadItems: async ({ commit, dispatch}, ids) => {
    //let ids2 = ids.filter(id => !state.items[id])
    if (ids.length) {
      return await Promise.all(ids.map(id => dispatch('loadItem', id)))
    }
    return await Promise.resolve([])
    
  },
  loadItem: async ({ commit, state}, id) => {
    let key = `item/${id}`
    let rt = state.items[id]
    if (!rt) {
      rt = await api.fetch(key)
      commit(types.ADD_ITEM_TO_CACHE, { item: rt })

    } else {
      if (api.debug)
        console.log('hit :', key)
    }
    return rt
  },


  loadUser: async ({ commit, state}, uid) => {
    let key = `user/${uid}`
    let rt = state.users[uid]

    if (!rt) {

      rt = await api.fetch(key)
      //  console.log(rt)
      commit(types.ADD_USER_TO_CACHE, { user: rt })

    }
    else {
      if (api.debug)
        console.log('hit :', key)

    }
    //  console.log(rt.displayName)
    return rt

  },
  async loadItemsByUser({ dispatch },{uid,type}){
    let user =await dispatch('loadUser',uid)
    let ids= user[type+'s']||[]
    //console.log(ids)
    return await dispatch('loadItems',ids)
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
  [types.SYNC_KIDS]: (state, {id, kids}) => {
    let item = state.items[id]
    if (!!item) {
       Vue.set(item, 'kids', kids)//确保其他依赖观察者同步
    }
  },
  [types.SYNC_OWNED]: (state, {uid, key, ids}) => {
    let user = state.users[uid]
    if (!!user) {
      Vue.set(user, key, ids)//确保其他依赖观察者同步
    }
    state.isNewBookAdded=true
  },

  [types.ADD_ITEM_TO_CACHE]: (state, {item}) => {
    if (!item)
      return
   // if (api.debug)
   //   console.log('ADD_ITEM_TO_CACHE', item.title)
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
   // if (api.debug)
  //    console.log('ADD_USER_TO_CACHE', user.displayName)
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
  getters,
  actions,
  mutations
}

