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
    updateScore(ownerId, appCfg.BIZ.AWARD)
  },
 
  async loadBookState({ dispatch }, { bookId}) {
    let old = await api.fetch(`biz/book/${bookId}`)
    old = old || { requesterId: null, time: Date.now(), state: '可借' }
    return old
  },
  async updateBookState({ dispatch }, {ownerId, bookId, requesterId, wantState}) {
    let flag = false
    let s1,s2
    let old = await api.fetch(`biz/book/${bookId}`)
    old = old || {}
    old = old.state || '可借'

    if (!ownerId || !requesterId) {
      console.log('ownerId or requesterId is null')
      return {ok:false,requester:0,owner:0}
      
    }
    await dispatch('beginLoad')
    let ownerScore = await api.fetch(`biz/user/${ownerId}`)
    
    if (ownerScore==null) {
      ownerScore = appCfg.BIZ.DEFAULT
      await updateScore(ownerId, ownerScore)
     
    }
    let reqScore = await api.fetch(`biz/user/${requesterId}`)
    //console.log(reqScore)
    if (reqScore==null) {
      reqScore = appCfg.BIZ.DEFAULT
      updateScore(requesterId, reqScore)
    }

    if (api.debug)
      console.log('updateBookState:', wantState)
    switch (wantState) {
      case '申请':
        if ('可借' === old && reqScore >= appCfg.BIZ.PLEDGE) {
          await api.save(`biz/book/${bookId}`,
            { state: wantState, requesterId, time: Date.now() })
             console.log(`save :biz/book/${bookId}`)
          flag = true
        }
        break
      case '借出':
        if ('申请' == old && reqScore >= appCfg.BIZ.PLEDGE) {
          await api.update(`biz/book/${bookId}`,
            { state: wantState, time: Date.now() })
           s1=await updateScore(requesterId, 0 - appCfg.BIZ.PLEDGE)
          // s2=await updateScore(ownerId, appCfg.BIZ.PLEDGE)
         // if (api.debug) console.log(ownerId,s1,requesterId)
           commit(types.SYNC_MY_SCORE,{score:s1})
          flag = true
        }
        break
      case '可借':
        await api.save(`biz/book/${bookId}`,
          { state: wantState, time: Date.now() })
        if ('借出' == old) {
           s1=await updateScore(requesterId, appCfg.BIZ.PLEDGE - appCfg.BIZ.FEE)
           s2=await updateScore(ownerId, appCfg.BIZ.FEE)
          if (api.debug) console.log(ownerId,s2,requesterId,s1)
          commit(types.SYNC_MY_SCORE,{score:s2})
        }
        flag = true
        break
      default:
    }
    await dispatch('afterLoad')
    return {ok:flag,requester:s1,owner:s2}
  }
}


export default {

  actions
}
