<script setup>
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'

const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'login' })
}

onMounted(async () => {
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
      :balance="authStore.currentUser?.money"
      @logout="handleLogout"
    />
    <RouterView />
  </main>
</template>
