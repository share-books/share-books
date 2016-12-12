import Vue from 'vue'

export function ObjPropKeys2Array(obj) {
  let data = obj || {}
  let rt = []
  for (let p in data){
      rt.push(p)
  }

  return rt
}
export function ObjIntPropKeys2Array(obj) {
  let data = obj
  if(!data) data= {}
  let rt = []
  //console.log("obj:",data)
  for (let p in data){
      let n=Number(p)
      if(n!=NaN) rt.push(n)
  }
  return rt
}

export const find = (data, item) => {
  data = data || []
  return data.find(p => p === item)
}
export const loadDataFromIds = (data, ids, key = 'id') => {
  data = data || []
  ids = ids || []
  return ids.map(id => {
    const item = data.find(p => p[key] === id)
    return Vue.util.extend({}, item)
  })
}
