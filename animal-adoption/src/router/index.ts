import { createRouter, createWebHistory } from 'vue-router'
import AnimalsView from '../views/AnimalsView.vue'
import AccountView from '../views/AccountView.vue'

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
      path: '/accounts/:id',
      name: 'account',
      component: AccountView,
    },
  ],
})

export default router
