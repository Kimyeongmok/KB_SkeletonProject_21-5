<script setup>
import { onMounted, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'

const THEME_KEY = 'kb-theme'
const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const isDarkMode = ref(false)

function applyTheme(mode) {
  document.documentElement.dataset.theme = mode
  isDarkMode.value = mode === 'dark'
}

function toggleTheme() {
  const nextTheme = isDarkMode.value ? 'light' : 'dark'
  localStorage.setItem(THEME_KEY, nextTheme)
  applyTheme(nextTheme)
}

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(async () => {
  applyTheme(localStorage.getItem(THEME_KEY) || 'light')
  authStore.restoreSession()

  if (!authStore.currentUser?.id) {
    router.push({ name: 'login' })
    return
  }

  if (!financeStore.transactions.length && !financeStore.isLoading) {
    await financeStore.loadFinanceData(authStore.currentUser.id)
  }
})
</script>

<template>
  <main class="dashboard-page">
    <AppHeader
      :user-name="authStore.currentUser?.name"
      :user-id="authStore.currentUser?.userId"
      :is-dark-mode="isDarkMode"
      @logout="handleLogout"
      @toggle-theme="toggleTheme"
    />
    <RouterView />
  </main>
</template>
