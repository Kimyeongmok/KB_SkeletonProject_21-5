<script setup>
import MainMenu from '@/components/MainMenu.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useAuthStore } from '@/stores/auth'
import { formatCurrency } from '@/utils/format'

const authStore = useAuthStore()
const { currentMonth, currentMonthChartData, currentBudget, currentMonthSpent, summary } = useFinanceDashboard()
</script>

<template>
  <section class="overview-shell">
    <div class="overview-main">
      <section class="panel summary-panel-card">
        <div class="section-heading compact">
          <div>
            <h2>총 자산 요약</h2>
          </div>
        </div>
        <SummaryCards
          :summary="summary"
          :budget="currentBudget?.limit ?? 0"
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
        <small>(이번 달 기준)</small>
      </section>

      <section class="panel side-menu-panel">
        <MainMenu />
      </section>
    </aside>
  </section>
</template>
