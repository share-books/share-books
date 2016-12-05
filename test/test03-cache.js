//@flow

import test from 'ava'

import api from '../src/api'
import store from '../src/store'
import AppCfg from '../config/app'
   
 test('load item from cache', async t => {
     AppCfg.CACHE.MAX_RECORDS=3
     let rawAPI=api.api

   let user= await api.login(13612345678,123456)
  /*
    await rawAPI.remove()
    await  api.save('user/'+user.uid,{phone:'13612345678',displayName:'Tom',uid:user.uid})
    await  api.save('maxid',0)
    await api.save('new-books',[])
    let data={title:'Book 1',type:'',parent:0}
    await store.dispatch('addItem',data) //load user
    let data2={title:'Book 2',type:'',parent:0}
    await store.dispatch('addItem',data2) // hit user
    let data3={title:'comment for book1',type:'comment',parent:1} //load item/1
    await store.dispatch('addItem',data3) // hit user

    await store.dispatch('loadItem',1) //hit item/1
    await store.dispatch('loadItem',2) //load item/2
    await store.dispatch('loadItem',3) //load item/3 RM_USER

    await store.dispatch('loadItem',1) //hit item/1
    await store.dispatch('loadItem',2) //hit item/2
    await store.dispatch('loadItem',3) //hit item/3
    store.dispatch('debug')*/
    let data=await store.dispatch('loadItemsByUser',{uid:user.uid,type:'book'})
    t.is(2,data.length)
    data=await store.dispatch('loadItemsByUser',{uid:user.uid,type:'comment'})
    t.is(1,data.length)
     
})


