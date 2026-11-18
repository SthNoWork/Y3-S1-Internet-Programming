<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts';
import router from '@/router';
import { reactive } from 'vue';

const form = reactive({
  username: '',
  email: '',
  password: '',
  retypePassword: ''
})

const errors = reactive({
  username: '',
  email: '',
  password: '',
  retypePassword: ''
})

function validate(): boolean {
  errors.username = ''
  errors.email = ''
  errors.password = ''
  errors.retypePassword = ''

  let isValid = true
  if (!form.username.trim() || form.username.length < 3) {
    errors.username = 'Username must be at least 3 characters'
    isValid = false
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email || !emailRegex.test(form.email)) {
    errors.email = 'Please provide a valid email'
    isValid = false
  }
  if (!form.password || form.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
    isValid = false
  }
  if (form.password !== form.retypePassword) {
    errors.retypePassword = "Passwords don't match"
    isValid = false
  }
  return isValid
}

function handleSignUp() {
  if (!validate()) return

  const newId = Date.now()
  ACCOUNTS[newId] = {
    id: newId,
    name: form.username,
    email: form.email,
    password: form.password,
    banned: false
  }
  localStorage.setItem('accounts', JSON.stringify(ACCOUNTS))
  router.push(`/login`)
}

</script>

<template>
  <main class="Signup-page">
    <h2>Find their forever home!</h2>
    <form @submit.prevent="handleSignUp()" class="create-form" novalidate>
      <div class="field">
        <input v-model="form.username" type="text" placeholder="Enter your username">
        <span v-if="errors.username" class="error-text">{{ errors.username }}</span>
      </div>
      <div class="field">
        <input v-model="form.email" type="email" placeholder="Enter your email">
        <span v-if="errors.email" class="error-text">{{ errors.email }}</span>
      </div>
      <div class="field">
        <input v-model="form.password" type="password" placeholder="Enter your password">
        <span v-if="errors.password" class="error-text">{{ errors.password }}</span>
      </div>
      <div class="field">
        <input v-model="form.retypePassword" type="password" placeholder="Retype your password">
        <span v-if="errors.retypePassword" class="error-text">{{ errors.retypePassword }}</span>
      </div>
      <button type="submit">Create</button>
    </form>
    <p>Already have an account?</p>
    <RouterLink to="/login">Log In</RouterLink>
  </main>
</template>


<style scoped>
.Signup-page {
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
  min-height: 100vh;
}

.create-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.create-form input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}

.error-text {
  color: #dc2626;
  font-size: 0.85rem;
}
</style>
