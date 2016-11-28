// this is aliased in webpack config based on server/client build
import api from './create-api'
import * as userMgr from './userMgr'
import wilddog from 'wilddog'

 
export  function  watchList(type, cb){
  const ref = api.child(`${type}-books`)
  const handler = snapshot => {
    cb(snapshot.val())
  }
  ref.on('value', handler)
  return () => {
    ref.off('value', handler)
  }
}
export  function  fetchItem(id){
  return fetch(`item/${id}`)
}

export  function  fetchItems(ids){
  return Promise.all(ids.map(id => fetchItem(id)))
}

export  function  fetchUser(id){
  return fetch(`user/${id}`)
}
export  function  fetchIdsByType(type) {
  return api.cachedIds && api.cachedIds[type]
    ? Promise.resolve(api.cachedIds[type])
    : fetch(`${type}-books`)
}

export async function  addItem(item,parent=0){
  let id=await fetchNextId()
  item.id = id
  let uid=userMgr.curUser().uid
  let user=await fetchUser(uid)
  item.uid=uid
  item.by=user.displayName
  //console.log('add item',item)
  item.type=parent>0?'comment':'book'
  if(parent>0) {
    item.parent = parent
  }
  let key=`item/${id}`
  await api.child(key).set(item)
 // api.cachedItems.set(key,item)
  if(parent>0) {
     let p=await fetchItem(parent)
     p.kids=p.kids||[]
     p.kids.unshift(id)
     let pk=`item/${parent}`
     await api.child(pk+'/kids').set(p.kids)
   }


  if ("book"===item.type){
     let data=api.cachedIds['new']||[]
     data.unshift(id)
     await api.child('new-books').set(data)
     api.cachedIds['new']=data
     user.books=user.books||[]
     user.books.unshift(id)
     await api.child(`user/${uid}/books`).set(user.books)
  } else{
     user.comments=user.comments||[]
     user.comments.unshift(id)
     await api.child(`user/${uid}/comments`).set(user.comments)
  }
  //api.cachedItems.set(`user/${uid}`,user)
  return item
}
export async function  getMyBooks(){
  let user =userMgr.curUser()
  user=await fetchUser(user.uid)
  data=user.books||[]
  console.log('getMyBooks',data.length)
  let data =await Promise.all(data.map(id => fetchItem(id)))
  return data
}
export async function  likeItem(itemId){
   let user=await fetchUser(userMgr.curUser().uid)
   let uid=userMgr.curUser().uid
   user.likes=user.likes||[]
   const d = user.likes.find(p => p === itemId)
   if( !d) {
      let result=await api.child(`item/${itemId}/score`).transaction(currentValue => {
         let id = (currentValue || 0) + 1   // 判断计数器是否为空或者是自增加
         return id
      })
      let score = result.snapshot.val()
      user.likes.unshift(itemId)
      await api.child(`user/${uid}/likes`).set(user.likes)
     // api.cachedItems.set(`user/${user.uid}`,user)
  }
  //console.log('already like')
}


export async function  updateTop(){
 let data=api._tops
 //console.log(data)

 let len=data.length
 if (len>30) {
     len=30
      data.slice(0, len)
 }
 api.child('top-books').set(data)
}

export  function  debug(){
  let data=api.cachedItems.dump()
  data.forEach(function(element) {
    console.log(element)
  }, this);
  
}
function fetch(child) {
  const cache = api.cachedItems
  if (cache && cache.has(child)) {
    let rt=cache.get(child)
    //console.log('load from cache for:',child,rt)
    return Promise.resolve(rt)
  } else {
    return new Promise((resolve, reject) => {
      api.child(child).once('value', snapshot => {
        const val = snapshot.val()
        // mark the timestamp when this item is cached
        if (val) val.__lastUpdated = Date.now()
        cache && cache.set(child, val)
        resolve(val)
      }, reject)
    })
  }
}
function fetchNextId() {
  return new Promise((resolve, reject) => {
    api.child('maxid').transaction(currentValue => {
      let id = (currentValue || 0) + 1   // 判断计数器是否为空或者是自增加
      return id
    }).then(result => {
      if (result.committed) {
       // console.log('transaction commit success!')
        let id = result.snapshot.val()
       // console.log("New ID: ", id)
        api.child('maxid').set(id)
        resolve(id)
      } else {
        reject("bad next id")
      }
    })
  })
}
