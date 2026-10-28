<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const isLogin = ref(true)
const name = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

const authStore = useAuthStore()
const router = useRouter()

const toggleAuth = () => {
  isLogin.value = !isLogin.value
  error.value = ''
}

const handleSubmit = async () => {
  try {
    error.value = ''
    if (isLogin.value) {
      await authStore.login(email.value, password.value)
    } else {
      await authStore.register(name.value, email.value, password.value)
      isLogin.value = true
      email.value = ''
      password.value = ''
      name.value = ''
      return
    }
    router.push('/animals')
  } catch (err: any) {
    error.value = err.message || 'An error occurred'
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h2 class="auth-title">{{ isLogin ? 'Login to Paw Finder' : 'Create an Account' }}</h2>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="error" class="error-banner">
          {{ error }}
        </div>

        <div v-if="!isLogin" class="form-group">
          <label for="name">Name</label>
          <input id="name" v-model="name" type="text" required placeholder="Your full name" />
        </div>

        <div class="form-group">
          <label for="email">Email address</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com" />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input id="password" v-model="password" type="password" required placeholder="••••••••" />
        </div>

        <button type="submit" class="submit-btn">
          {{ isLogin ? 'Sign In' : 'Sign Up' }}
        </button>
      </form>

      <div class="toggle-link">
        <p v-if="isLogin">
          Don't have an account? 
          <a href="#" @click.prevent="toggleAuth">Create one</a>
        </p>
        <p v-else>
          Already have an account? 
          <a href="#" @click.prevent="toggleAuth">Sign in instead</a>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 48px 16px;
  min-height: calc(100vh - 120px);
  background: #f8fafc;
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: #ffffff;
  padding: 32px 24px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid #e2e8f0;
}

.auth-title {
  margin: 0 0 24px 0;
  font-size: 24px;
  font-weight: 800;
  text-align: center;
  color: #0f172a;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.error-banner {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fee2e2;
  padding: 10px 12px;
  border-radius: 6px;
  font-size: 14px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.form-group input {
  padding: 10px 12px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 14px;
  color: #0f172a;
  transition: border-color 0.15s ease;
}

.form-group input:focus {
  outline: none;
  border-color: #0284c7;
}

.submit-btn {
  background: #0284c7;
  color: #ffffff;
  border: none;
  padding: 12px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s ease;
  margin-top: 8px;
}

.submit-btn:hover {
  background: #0369a1;
}

.toggle-link {
  margin-top: 20px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.toggle-link a {
  color: #0284c7;
  font-weight: 600;
  text-decoration: none;
}

.toggle-link a:hover {
  text-decoration: underline;
}
</style>
