import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Swap from '../views/Swap.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/swap/:swapId',
    name: 'Swap',
    props: true,
    component: Swap
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
