<script setup>
import BudgetCard from '@/components/BudgetCard.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const {
  currentMonth,
  currentBudget,
  currentMonthSpent,
  currentMonthChartData,
  summary,
  handleBudgetSave,
} = useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid">
    <BudgetCard
      class="panel budget-panel"
      :month="currentMonth"
      :budget="currentBudget?.limit ?? 0"
      :spent="currentMonthSpent"
      @save-budget="handleBudgetSave"
    />

    <section class="panel wide-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">예산 현황</p>
          <h2>이번 달 요약</h2>
        </div>
      </div>
      <SummaryCards :summary="summary" />
    </section>

    <section class="panel full-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">예산 참고 차트</p>
          <h2>이번 달 수입 / 지출 분포</h2>
        </div>
      </div>
      <MonthlySummaryTable :month="currentMonth" :items="currentMonthChartData" />
    </section>
  </section>
</template>
