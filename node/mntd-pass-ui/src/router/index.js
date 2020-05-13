import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import notFound404 from '../views/notFound404.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '*',
    name: 'notFound404',
    component: notFound404
  },
  {
    path: '/',
    name: 'Login',
    component: Login
  },

  {
    path: '/secrets',
    name: 'secrets',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/Secrets.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
