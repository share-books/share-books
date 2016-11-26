import * as types from './mutation-types'

export const addToCart = ({ commit }, book) => {
      commit(types.ADD_TO_CART, book)
}
