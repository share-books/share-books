import * as types from '../mutation-types'
import api from '../../api'
import appCfg from '../../../config/app'
/**
 * 完成操作：借书和还书
 * 每个用户默认有10个积分，每次借书需要扣除10个积分押金并后剩余积分大于0
 * 还书时归换9个积分点，1个积分转移给图书所有者
 * 发布新书时可以增加5个积分点，这样可以鼓励大家多贡献图书
 */

async function updateScore(uid,delta): number {
  return api.transaction(`biz/user/${uid}`, delta)
}
async function updateBookState(state:Object,wantBookState:string): boolean {
  let flag=false
  let bookId=state.bookId
  let ownerId=state.ownerId
  let requesterId=state.requesterId
  let old = await api.fetch(`biz/book/${bookId}`)
  old=old||{}
  old=old.state || '可借'
  let ownerScore = await api.fetch(`biz/user/${ownerId}`)
  ownerScore=ownerScore||appCfg.BIZ.DEFAULT
  let reqScore = await api.fetch(`biz/user/${requesterId}`)
   reqScore=reqScore||appCfg.BIZ.DEFAULT
  console.log(ownerId,bookId,requesterId)
  switch(wantBookState){
    case '申请':
       if ('可借'==old&&reqScore>=appCfg.BIZ.PLEDGE) {
         let dd=await api.save(`biz/book/${bookId}`,
               {state:wantBookState,ownerId,requesterId,time:Date.now()})
          console.log(dd)
         flag=true
       }
       break
    case '借出':
       if ('申请'==old&&reqScore>=appCfg.BIZ.PLEDGE) {
         await api.update(`biz/book/${bookId}`,
               {state:wantBookState,time:Date.now()})
         updateScore(requesterId,0-appCfg.BIZ.PLEDGE)
         updateScore(ownerId,appCfg.BIZ.PLEDGE)
         flag=true
       }
       break 
    case '可借':
       await api.save(`biz/book/${bookId}`,
              {state:wantBookState,time:Date.now()})
       if ('借出'==old) {
         updateScore(requesterId,appCfg.BIZ.PLEDGE-appCfg.BIZ.FEE)
         updateScore(ownerId,appCfg.BIZ.FEE-appCfg.BIZ.PLEDGE)
       }
       flag=true
       break   
    default:
  }
  return flag
}
// actions
const actions = {
  award ({ commit },ownerId) {
    updateScore(ownerId,appCfg.BIZ.AWARD)
  },
  async loadBookState ({ commit },{ownerId,bookId}) {
    let old = await api.fetch(`biz/book/${bookId}`)
    old=old||{ownerId,bookId,time:Date.now(),state:'可借'}
    return old
  },
  async applyBookState ({ commit },{ownerId,bookId,requesterId},wantState) {
    let rt=await updateBookState({ownerId,bookId,requesterId},wantState)
    return rt
  }
}
/*
const state = {
  bookId: '',
  ownerId: '',
  requesterId: ''
}

// getters
const getters = {
  status: state => state
}*/

export default {
  actions
}
