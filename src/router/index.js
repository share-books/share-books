import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

//import { createList } from '../views/CreateList'
//import Item from '../views/Item.vue'
//import User from '../views/User.vue'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Top from '../views/Top.vue'
import New from '../views/New.vue'
import User from '../views/User.vue'
import Profile from '../views/Profile.vue'
import MyBooks from '../views/MyBooks.vue'

function requireAuth (to, from, next) {
  if (!store.state.app.me.authenticated) {
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
    {name: 'home',path: '/home', component: Home },
    {name: 'me',path: '/me', component: User ,
    children: [
        {
          path: 'profile',
          component: Profile
        },
        {
          // 当 /user/:id/posts 匹配成功
          // UserPosts 会被渲染在 User 的 <router-view> 中
          path: 'owner',
          component: MyBooks
        }
      ]

    },
    { path: '/login', component: Login },
     { path: '/register', component: Register },
     { path: '/top', component: Top , beforeEnter: requireAuth},
      { path: '/new', component: New },
  /* { path: '/top/:page(\\d+)?', component: createListView('top') , beforeEnter: requireAuth},
    { path: '/new/:page(\\d+)?', component: createListView('new') , beforeEnter: requireAuth},
 
    { path: '/item/:id(\\d+)', component: ItemView , beforeEnter: requireAuth},
    { path: '/user/:id', component: UserView , beforeEnter: requireAuth},*/
    { path: '/logout', beforeEnter (to, from, next) {
       // auth.logout()
       store.dispatch("logout")
      // console.log('logout')
        next('/home')
      }
    },
    { path: '*', redirect: '/home' }
  ]
})


export default router