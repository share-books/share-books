//@flow

import test from 'ava'
import api from '../src/api'

test('wilddog api test',async  t => {
    api.login(13640327787,123456)
    await api.save('maxid',0)
    let data1=await api.fetch('maxid')
    t.is( 0, data1)
    let nextid=await api.transaction('maxid',1)
     t.is( 1, nextid)
    let u={name:'alex',age:45}
     await api.update('user/alex',u)
    let data2=await api.fetch('user/alex')

     t.deepEqual( u, data2)
     await api.update('user/alex',{age:35})
     let data3=await api.fetch('user/alex')

     t.deepEqual( {name:'alex',age:35},data3)
     api.logout()

})
