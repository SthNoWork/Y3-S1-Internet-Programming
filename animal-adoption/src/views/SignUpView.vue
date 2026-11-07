<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts';
import router from '@/router';
import { ref } from 'vue';

const username = ref('')
const email = ref('')
const password = ref('')
const retypePassword = ref('')

function handleSignUp() {
  if (password.value === retypePassword.value) {
    const newId = Date.now()
    ACCOUNTS[newId] = {
      name: username.value,
      email: email.value,
      password: password.value,
      banned: false
    }
    localStorage.setItem('account', JSON.stringify(ACCOUNTS))
    router.push(`/login`)
  } else {
    alert(`passwords don't match`)
  }
}

</script>

<template>
  <main class="Signup-page">
    <h2>Find their forever home!</h2>
    <form @submit.prevent="handleSignUp()" class="create-form">
      <input v-model="username" type="text" placeholder="Enter your username">
      <input v-model="email" type="email" placeholder="Enter your email">
      <input v-model="password" type="password" placeholder="Enter your password">
      <input v-model="retypePassword" type="password" placeholder="Retype your password">
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

.create-form input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}
</style>
