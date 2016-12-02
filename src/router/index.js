import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
import { createList } from '../views/createList'
import Item from '../views/Item.vue'

import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
//import Top from '../views/Top.vue'
//import New from '../views/New.vue'
import User from '../views/User.vue'
import MyBooks from '../views/MyBooks.vue'

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
  mode: 'history',
  linkActiveClass:'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: [
    
    {name: 'me',path: '/me', component: User ,beforeEnter: requireAuth,
    children: [
          {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'books',
          component: MyBooks
        }
      ]

    },
    { path: '/login', component: Login },
     { path: '/register', component: Register },
    // { path: '/top', component: Top , beforeEnter: requireAuth},
   //  { path: '/new', component: New },
    { path: '/top/:page(\\d+)?', component: createList('top')},
    { path: '/new/:page(\\d+)?', component: createList('new') },
 
    { path: '/item/:id(\\d+)', component: Item , beforeEnter: requireAuth},
   /* { path: '/user/:id', component: UserView , beforeEnter: requireAuth},*/
    { path: '/logout', beforeEnter (to, from, next) {
       // auth.logout()
       store.dispatch("logout").then(msg=>{
            console.log("logout",msg)
            next('/home')
       })
      }
    },
    {name: 'home',path: '/', component: Home },
    //{ path: '／', redirect: '/home' }
  ]
})


export default router