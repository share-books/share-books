import Vue from 'vue'



export const find=(data,item)=>{
  data=data||[]
  return data.find(p=>p===item)
}
export const loadDataFromIds = (data,ids,key='id') => {
  data=data||[]
  ids=ids||[]
  return ids.map(id => {
    const item = data.find(p => p[key] === id)
    return Vue.util.extend({}, item)
  })
}
