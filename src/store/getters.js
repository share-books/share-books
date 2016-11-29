export const myBooks = state => {
  return state.self.myBookIds.map( id => {
    return state.list.items.find(item => item.id === id)
  })
   
}

  // console.log(all.length)
  /*  state.dashboad.top_books.forEach(p=>{
      let item=all.find(t => t.id === p.id)
      if (!item) all.push(item)
    })*/