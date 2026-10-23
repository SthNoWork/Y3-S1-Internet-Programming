import { createRouter, createWebHistory } from 'vue-router'
import AnimalsView from '../views/AnimalsView.vue'
import AccountView from '../views/AccountView.vue'
import MapView from '../views/MapView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/animals',
    },
    {
      path: '/animals',
      name: 'animals',
      component: AnimalsView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/accounts/:id',
      name: 'account',
      component: AccountView,
    },
  ],
})

export default router
