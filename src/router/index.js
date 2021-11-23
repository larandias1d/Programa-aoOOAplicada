import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import CdCrud from '../components/CdCrud.vue'
import GravadoraCrud from '../components/GravadoraCrud.vue'



Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/cds',
    name: 'CDs',
    component: CdCrud
  },
  {
    path: '/gravadoras',
    name: 'Gravadora',
    component: GravadoraCrud
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
