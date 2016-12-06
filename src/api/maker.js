//src/api/maker.js
//@flow

import wilddog from 'wilddog'
import Vue from 'vue'
import WildVue from 'wildvue'

Vue.use(WildVue)

const config={
  dev:{
    authDomain: "books.wilddog.com",
    syncURL: "https://books.wilddogio.com/test" 
  },
  prd:{
    authDomain: "books.wilddog.com",
    syncURL: "https://books.wilddogio.com/v2" 

  }

}
let syncURL
function maker(isPrd? : boolean){
    let cfg=!isPrd?config['dev']:config['prd']
    wilddog.initializeApp(cfg)
    return wilddog.sync().ref()

}



export default maker