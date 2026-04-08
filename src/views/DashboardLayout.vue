<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import Menu from '@/components/Menu.vue'
import UserBalance from '@/components/UserBalance.vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/format'

const THEME_KEY = 'kb-theme'
const router = useRouter()
const authStore = useAuthStore()
const financeStore = useFinanceStore()
const isDarkMode = ref(false)

const currentMoney = computed(() => Number(authStore.currentUser?.money || 0))

const previousMonthMoney = computed(
  () => currentMoney.value - Number(financeStore.currentMonthSummary?.balance || 0),
)

const moneyDeltaLabel = computed(() => {
  const delta = Number(financeStore.currentMonthSummary?.balance || 0)

  if (delta > 0) {
    return `지난달 대비 +${formatCurrency(delta)}`
  }

  if (delta < 0) {
    return `지난달 대비 ${formatCurrency(delta)}`
  }

  return '지난달과 동일'
})

const moneyDeltaClass = computed(() => {
  const delta = Number(financeStore.currentMonthSummary?.balance || 0)

  if (delta > 0) return 'income-text'
  if (delta < 0) return 'expense-text'
  return ''
})

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
    <Header
      :user-name="authStore.currentUser?.name"
      :user-id="authStore.currentUser?.userId"
      :is-dark-mode="isDarkMode"
      @logout="handleLogout"
      @toggle-theme="toggleTheme"
    />

    <section class="dashboard-layout-shell">
      <div class="dashboard-layout-content">
        <RouterView />
      </div>

      <aside class="dashboard-layout-sidebar">
        <UserBalance
          :current-money="currentMoney"
          :previous-month-money="previousMonthMoney"
          :money-delta-label="moneyDeltaLabel"
          :money-delta-class="moneyDeltaClass"
        />

        <section class="panel side-menu-panel">
          <Menu />
        </section>
      </aside>
    </section>
  </main>
</template>
