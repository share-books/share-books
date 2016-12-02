//@flow

import test from 'ava'

import api from '../src/api'
import store from '../src/store'
import AppCfg from '../config/app'

    
    
    
 test('load item from cache', async t => {
     AppCfg.CACHE.MAX_RECORDS=3
     let rawAPI=api.api

   let user= await api.login(13612345678,123456)
  // console.log(user)
    await rawAPI.remove()
    await  api.save('user/'+user.uid,{phone:'13612345678',displayName:'test',uid:user.uid})
    await  api.save('maxid',0)
    await api.save('new-books',[])
    let data={title:'demo',uid:'',id:0,type:'',parent:0}
    await store.dispatch('addItem',data)
    let data2={title:'demo2',uid:'alex',id:0,type:'',parent:0}
    await store.dispatch('addItem',data2)
    let data3={title:'demo3',uid:'alex',id:0,type:'',parent:1}
    await store.dispatch('addItem',data3)

    await store.dispatch('loadItem',1)
    // keys=Object.keys(store.state.cache.items)
    // t.is( 1, keys.length) ??3

    await store.dispatch('loadItem',2)
    await store.dispatch('loadItem',3)

     await store.dispatch('loadItem',1)
      await store.dispatch('loadItem',2)
    await store.dispatch('loadItem',3)
    store.dispatch('debug')
     
})


