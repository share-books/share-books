import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { createList } from '../views/createList'
//import NewList from '../views/NewList'
import Donate from '../views/Donate.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'


import Register from '../views/Register.vue'
import User from '../views/User.vue'
import ItemInfo from '../views/ItemInfo.vue'
import UserBooks from '../views/UserBooks.vue'
import Query from '../views/Query.vue'
//import Upload from '../views/Upload.vue'

Vue.use(Router)


function requireAuth (to, from, next) {
  if (!store.state.self.authenticated) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

let router=new Router({
 // mode: 'hash',
  mode: 'history',
 // linkActiveClass:'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
   {name: 'home',path: '/home', component: Home },
   { path: '/donate', component: Donate },
   { path: '/login', component: Login },
   { path: '/register', component: Register },
   { name: 'top',path: '/top', component: createList('top')},
   { name: 'new',path: '/new', component: createList('new')},
   { name: 'query',path: '/query', component: Query},
  // { path: '/top/:page', component: Top , beforeEnter: requireAuth},
  // { path: '/new/:page', component: New },
   { name: 'item',path: '/item/:id', component: ItemInfo },

   {name: 'user',path: '/user/:uid', component: User ,//beforeEnter: requireAuth,
     children: [
          {
          // 当 /user/:id/books 匹配成功
          // books 会被渲染在 User 的 <router-view> 中
          path: 'books',
          name: 'userbooks',
          component: UserBooks
        }
      ]

    },
   { path: '/logout', beforeEnter (to, from, next) {
       // auth.logout()
       store.dispatch("logout").then(msg=>{
            //console.log("logout",msg)
            next('/home')
       })
      }
    },
    { path: '*', redirect: '/home' }

    
  ]
})


export default router