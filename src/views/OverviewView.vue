<script setup>
import MainMenu from '@/components/MainMenu.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import MonthlyProgressOverview from '@/components/MonthlyProgressOverview.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency } from '@/utils/format'
import { computed } from 'vue'

const authStore = useAuthStore()
const {
  currentMonth,
  currentMonthChartData,
  currentBudget,
  currentMonthSpent,
  currentMonthIncome,
  currentMonthSummary,
} = useFinanceDashboard()

const previousMonthMoney = computed(() =>
  Number(authStore.currentUser?.money || 0) - Number(currentMonthSummary.value.balance || 0),
)

const moneyDeltaLabel = computed(() => {
  const delta = Number(currentMonthSummary.value.balance || 0)

  if (delta > 0) {
    return `지난달 대비 +${formatCurrency(delta)}`
  }

  if (delta < 0) {
    return `지난달 대비 ${formatCurrency(delta)}`
  }

  return '지난달과 동일'
})

const moneyDeltaClass = computed(() => {
  const delta = Number(currentMonthSummary.value.balance || 0)

  if (delta > 0) {
    return 'income-text'
  }

  if (delta < 0) {
    return 'expense-text'
  }

  return ''
})
</script>

<template>
  <section class="overview-shell">
    <div class="overview-main">
      <section class="panel summary-panel-card">
        <MonthlyProgressOverview
          :month="currentMonth"
          :budget="currentBudget?.limit ?? 0"
          :income="currentMonthIncome"
          :spent="currentMonthSpent"
        />
      </section>

      <section class="panel recent-panel-card">
        <div class="section-heading compact">
          <div>
            <h2>수입 / 지출 그래프</h2>
          </div>
          <span class="count-chip">{{ currentMonth }}</span>
        </div>

        <MonthlySummaryTable :month="currentMonth" :items="currentMonthChartData" />
      </section>
    </div>

    <aside class="overview-side">
      <section class="panel money-panel">
        <p class="section-label">현재 보유 금액</p>
        <strong>{{ formatCurrency(authStore.currentUser?.money || 0) }}</strong>
        <small :class="moneyDeltaClass">{{ moneyDeltaLabel }}</small>
        <small>지난달 추정 잔액 {{ formatCurrency(previousMonthMoney) }}</small>
      </section>

      <section class="panel side-menu-panel">
        <MainMenu />
      </section>
    </aside>
  </section>
</template>
