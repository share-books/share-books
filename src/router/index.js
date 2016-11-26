import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'
Vue.use(Router)

//import { createListView } from '../views/CreateListView'
//import ItemView from '../views/ItemView.vue'
//import UserView from '../views/UserView.vue'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import TopView from '../views/TopView.vue'
import NewView from '../views/NewView.vue'

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
    {name: 'home',path: '/', component: HomeView },
    { path: '/login', component: LoginView },
     { path: '/top', component: TopView , beforeEnter: requireAuth},
      { path: '/new', component: NewView },
  /* { path: '/top/:page(\\d+)?', component: createListView('top') , beforeEnter: requireAuth},
    { path: '/new/:page(\\d+)?', component: createListView('new') , beforeEnter: requireAuth},
 
    { path: '/item/:id(\\d+)', component: ItemView , beforeEnter: requireAuth},
    { path: '/user/:id', component: UserView , beforeEnter: requireAuth},*/
    { path: '/logout', beforeEnter (to, from, next) {
       // auth.logout()
       store.dispatch("logout")
      // console.log('logout')
        next('/')
      }
    },
    { path: '*', redirect: '/' }
  ]
})


export default router