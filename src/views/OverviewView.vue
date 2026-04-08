<script setup>
import BudgetProgressBanner from '@/components/BudgetProgressBanner.vue'
import MonthlyStatusCards from '@/components/MonthlyStatusCards.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const { currentMonth, currentMonthChartData, currentBudget, currentMonthSpent, currentMonthSummary } =
  useFinanceDashboard()
</script>

<template>
  <section class="overview-main">
    <BudgetProgressBanner
      :budget="currentBudget?.limit ?? 0"
      :spent="currentMonthSpent"
    />

    <MonthlyStatusCards
      :summary="currentMonthSummary"
      title="이번 달 진행 현황"
      subtitle="대시보드 요약"
    />

    <section class="panel recent-panel-card">
      <div class="section-heading compact">
        <div>
          <h2>수입 / 지출 그래프</h2>
        </div>
        <span class="count-chip">{{ currentMonth }}</span>
      </div>

      <MonthlySummaryTable :month="currentMonth" :items="currentMonthChartData" />
    </section>
  </section>
</template>
