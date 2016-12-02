import Vue from 'vue'
import * as businessMgr from '../../api'
import { login } from '../../api/userMgr'
import * as types from '../mutation-types'

// initial state
const state = {
  activeType: null,
  itemsPerPage: 2,
  items: {/* [id: number]: Item */ },
  users: {/* [id: string]: User */ },
  lists: {
    'top': [/* [id: number] */],
    'new': [/* [id: number]*/]
  }
}
const actions = {

  fetchListData: ({ commit, dispatch, state }, { type }) => {
    commit(types.SET_ACTIVE_TYPE, { type })
    dispatch('beginLoad')
    return businessMgr.fetchIdsByType(type)
      .then(ids => commit(types.SET_LIST, { type, ids }))
      .then(() => dispatch('ensureActiveItems'))
      .then(()=> dispatch('afterLoad'))
  },
  ensureActiveItems: ({ dispatch, getters }) => {
    return dispatch('fetchItems', {
      ids: getters.activeIds
    })
  },
  fetchItems: ({ commit, dispatch,state }, { ids }) => {
    // only fetch items that we don't already have.
   
    ids = ids.filter(id => !state.items[id])
    if (ids.length) {
      return businessMgr.fetchItems(ids).then(items => commit(types.SET_ITEMS, { items }))
    } else {
      return Promise.resolve()
    }
  },

  fetchUser: ({ commit, state }, { id }) => {
    return state.users[id]
      ? Promise.resolve(state.users[id])
      : businessMgr.fetchUser(id).then(user => commit(types.SET_USER, { id, user }))
  }
}

let mutations = {
  [types.SET_ACTIVE_TYPE]: (state, { type }) => {
    state.activeType = type
  },

  [types.SET_LIST]: (state, { type, ids }) => {
    state.lists[type] = ids
  },

  [types.SET_ITEMS]: (state, { items }) => {
    items.forEach(item => {
      if (item) {
        Vue.set(state.items, item.id, item)//确保其他依赖观察者同步
      }
    })
  },

  [types.SET_USER]: (state, { id, user }) => {
    Vue.set(state.users, id, user)
  }
}

let getters = {
  activeType: state => state.activeType,
  itemsPerPage: state => state.itemsPerPage,
  items: state => state.items,
  users: state => state.users,
  lists: state => state.lists,
  // ids of the items that should be currently displayed based on
  // current list type and current pagination
  activeIds:(state) => {
    const { activeType, itemsPerPage, lists } = state
    if (!activeType||!lists[activeType]||lists[activeType].length<1) return []
    console.log(activeType)
    console.log(lists[activeType].length)
    const page =!state.route?1: Number(state.route.params.page) || 1
    if (activeType) {
      const start = (page - 1) * itemsPerPage
      const end = page * itemsPerPage
      return lists[activeType].slice(start, end)
    } else {
      return []
    }
  },

  // items that should be currently displayed.
  // this Array may not be fully fetched.
  activeItems(state, getters) {
    return getters.activeIds.map(id => state.items[id]).filter(_ => _)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}


/*
// getters
const getters = {
  topBooks: state => state.list.top_books,
  newBooks:state => state.list.new_books
}
const actions = {

  getBooks({ commit },{type,ids}) {
    fetchItems(ids).then(books=>{
      commit(types.RECEIVE_BOOKS, {type, books })
    })
  }
}

// mutations
const mutations = {
 
  [types.RECEIVE_BOOKS] (state, {type, books }) {
     console.log('RECEIVE_BOOKS for ',type)
     console.log(books.length)
     if ('new'===type) {
        state.new_books = books
     }
     else {
        state.top_books = books
     }
  },

  [types.ADD_TO_CART] (state, book) {
     console.log('dashboad rev: ADD_TO_CART')
   // state.all.find(p => p.id === id).inventory--
  }
}
*/

