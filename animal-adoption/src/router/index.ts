import AccountView from '@/views/AccountView.vue'
import HomeView from '@/views/HomeView.vue'
import ManageView from '@/views/ManageView.vue'
import MapView from '@/views/MapView.vue'
import SearchView from '@/views/SearchView.vue'

import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      path: '/home',
      component: HomeView,
    },
    {
      path: '/search',
      component: SearchView,
    },
    {
      path: '/map',
      component: MapView,
    },
    {
      path: '/account/:id?',
      component: AccountView,
    },
    {
      path: '/manage',
      component: ManageView,
    },
  ],
})

export default router
