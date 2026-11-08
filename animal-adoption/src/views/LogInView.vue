<script setup lang="ts">
import { ACCOUNTS } from '@/data/accounts';
import router from '@/router';
import { useAdoptionStore } from '@/stores/adoptionStore';
import { ref } from 'vue';

const email = ref('')
const password = ref('')

const store = useAdoptionStore()



function handleSignIn() {
  const match = Object.entries(ACCOUNTS).find(([, account]) => {
    return account.email === email.value && account.password === password.value
  })

  if (match) {
    store.LOGGED_IN_ACCOUNT_ID = Number(match[0])
    store.privateAccount = match[1]
    router.push(`/account`)
  } else {
    alert(`Invaild email or password`)
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
    <form @submit.prevent="handleSignIn()" class="LogIn-form">
      <input v-model="email" type="email" placeholder="Enter your email">
      <input v-model="password" type="password" placeholder="Enter your password">
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

.LogIn-form input {
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: none;
  outline: none;
}
</style>
