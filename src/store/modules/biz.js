import * as types from '../mutation-types'
import {likeItem} from '../../api'
// initial state
// shape: [{ id, quantity }]
const state = {
  love: [],
  checkoutStatus: null
}

// getters
const getters = {
  checkoutStatus: state => state.checkoutStatus
}

// actions
const actions = {
  saveLike ({ commit, state },books) {
    if (books.length>0)
      likeItem(books[0].id).then(() => commit(types.CHECKOUT_SUCCESS))
  }
}

// mutations
const mutations = {
  [types.ADD_TO_CART] (state, { id }) {
    state.checkoutStatus = null
    const record = state.added.find(p => p === id)
    if (!record) {
      state.added.push(id)
    } 
  },

 
  [types.CHECKOUT_SUCCESS] (state) {
    state.checkoutStatus = 'successful'
  }

}

export default {
  state,
  getters,
  actions,
  mutations
}
