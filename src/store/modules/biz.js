import * as types from '../mutation-types'
import api from '../../api'
import appCfg from '../../../config/app'
/**
 * 完成操作：借书和还书
 * 每个用户默认有10个积分，每次借书需要扣除10个积分押金并后剩余积分大于0
 * 还书时归换9个积分点，1个积分转移给图书所有者
 * 发布新书时可以增加5个积分点，这样可以鼓励大家多贡献图书
 */

async function updateScore(uid, delta): number {
  return await api.transaction(`biz/user/${uid}`, delta)
}

// actions
const actions = {
  award({ commit }, ownerId) {
    updateScore(ownerId, appCfg.BIZ.AWARD).then((score)=>{
      commit(types.SYNC_MY_SCORE,{score})
    })
  },
 
  async loadBookState({ dispatch }, { bookId}) {
    let old = await api.fetch(`biz/book/${bookId}`)
    old = old || { requesterId: null, time: Date.now(), state: '可借' }
    return old
  },
  async updateBookState({ dispatch,commit }, {ownerId, bookId, requesterId, wantState}) {
    let flag = false
    let s1,s2
    let old = await api.fetch(`biz/book/${bookId}`)
    old = old || {}
    old = old.state || '可借'
    
    if (api.debug)
       console.log('updateBookState',ownerId, bookId, requesterId, wantState)
    if (!ownerId || !requesterId) {
      console.log('ownerId or requesterId is null')
      return {ok:false,requester:0,owner:0}
      
    }
    let ownerScore = await api.fetch(`biz/user/${ownerId}`)
    let reqScore = await api.fetch(`biz/user/${requesterId}`)
   if (ownerScore==null) {
      ownerScore = appCfg.BIZ.DEFAULT
      await updateScore(ownerId, ownerScore)
     if (api.debug)
       console.log('add defalt score for:',ownerId)
    }
    
    //console.log(reqScore)
    if (reqScore==null) {
      reqScore = appCfg.BIZ.DEFAULT
      updateScore(requesterId, reqScore)
       if (api.debug)
         console.log('add defalt score for:',requesterId)
    }
    await dispatch('beginLoad')
    
    
   
    switch (wantState) {
      case '申请':
        if ('可借' === old && reqScore >= appCfg.BIZ.PLEDGE) {
          await api.save(`biz/book/${bookId}`,
            { state: wantState, requesterId, time: Date.now() })
          console.log(`save :biz/book/${bookId}`)
          flag = true
        }else{
           let msg='租金要：'+String(appCfg.BIZ.PLEDGE)+'，你可以贡献新图书获得积分:-)'
            await dispatch('afterLoad')
           await   dispatch('notify',{type:'error',notify:msg})
        }
        break
      case '借出':
        if ('申请' == old && reqScore >= appCfg.BIZ.PLEDGE) {
          await api.update(`biz/book/${bookId}`,
            { state: wantState, time: Date.now() })
           s1=await updateScore(requesterId, 0 - appCfg.BIZ.PLEDGE)
           s2=await updateScore(ownerId, appCfg.BIZ.FEE)
           commit(types.SYNC_MY_SCORE,{score:s2})
          flag = true
        }else{
           let msg='申请者积分太少，你可以设置为可解状态，重新借给其他人:-('
            await dispatch('afterLoad')
           await   dispatch('notify',{type:'info',notify:msg})
        }
        break
      case '可借':
        await api.save(`biz/book/${bookId}`,
          { state: wantState, time: Date.now() })
        if ('借出' == old) {
           s1=await updateScore(requesterId, appCfg.BIZ.PLEDGE - appCfg.BIZ.FEE)
          //   if (api.debug) console.log(ownerId,s2,requesterId,s1)
           flag = true
        }
        
        break
      default:
    }
   if(flag)
      await dispatch('afterLoad')
    return {ok:flag,requester:s1,owner:s2}
  }
}


export default {

  actions
}
