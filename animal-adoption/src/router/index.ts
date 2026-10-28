import { createRouter, createWebHistory } from 'vue-router'
import AnimalsView from '../views/AnimalsView.vue'
import AccountView from '../views/AccountView.vue'
import MapView from '../views/MapView.vue'
import AuthView from '../views/AuthView.vue'
import ManageAnimalsView from '../views/ManageAnimalsView.vue'
import { useAuthStore } from '../stores/auth'

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
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/manage-animals',
      name: 'manage-animals',
      component: ManageAnimalsView,
      beforeEnter: () => {
        const authStore = useAuthStore()
        return authStore.isLoggedIn ? true : '/auth'
      },
    },
  ],
})

export default router
