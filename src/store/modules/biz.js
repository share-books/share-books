import * as types from '../mutation-types'

// 完成操作：文章点赞；借书和还书

const state = {
  myLikes: {},
  myBooks: {},
  myBorrows: {},
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
