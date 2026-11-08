<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts';
import router from '@/router';
import { useAdoptionStore } from '@/stores/adoptionStore';
import { reactive } from 'vue';

const form = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: '',
  general: ''
})

const store = useAdoptionStore()

function validate(): boolean {
  errors.email = ''
  errors.password = ''
  errors.general = ''

  let isValid = true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Please provide a valid email'
    isValid = false
  }
  if (!form.password) {
    errors.password = 'Password is required'
    isValid = false
  }
  return isValid
}

function handleLogIn() {
  if (!validate()) return

  const account = Object.values(ACCOUNTS).find((acc) => {
    return acc.email === form.email && acc.password === form.password
  })

  if (account) {
    store.LOGGED_IN_ACCOUNT_ID = account.id
    store.privateAccount = account
    router.push(`/account`)
  } else {
    errors.general = 'Invalid email or password'
  }
}

function devLogin() {
  const account = ACCOUNTS[1]
  if (!account) return

  store.LOGGED_IN_ACCOUNT_ID = 1
  store.privateAccount = account
  router.push('/account')
}

</script>

<template>
  <main class="LogIn-page">
    <h2>Find their forever home!</h2>
    <form @submit.prevent="handleLogIn()" class="LogIn-form" novalidate>
      <div class="field">
        <input v-model="form.email" type="email" placeholder="Enter your email">
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>
      <div class="field">
        <input v-model="form.password" type="password" placeholder="Enter your password">
        <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
      </div>
      <span v-if="errors.general" class="error-text general-error">{{ errors.general }}</span>
      <button type="submit">Log In</button>
      <button type="button" @click="devLogin">Dev Login (Account #1)</button>
    </form>
    <p>Don't have an account?</p>
    <RouterLink to="/signup">Sign Up</RouterLink>
  </main>
</template>


<style scoped>
.LogIn-page {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  min-height: 100vh;
}

.LogIn-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.LogIn-form input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
}

.general-error {
  text-align: center;
}
</style>
