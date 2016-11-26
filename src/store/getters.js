export const cartBooks = state => {
   let all= [...state.dashboad.new_books]
  // console.log(all.length)
    state.dashboad.top_books.forEach(p=>{
      let item=all.find(t => t.id === p.id)
      if (!item) all.push(item)
    })
  //console.log(all.length)
  return state.cart.added.map( id => {
    const product = all.find(p => p.id === id)
    return {
      id: product.id,
      title: product.title
    }
  })
}
