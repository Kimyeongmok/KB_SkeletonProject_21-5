<script setup>
import BudgetCard from '@/components/BudgetCard.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import ThreeMonthExpenseChart from '@/components/ThreeMonthExpenseChart.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const {
  currentMonth,
  currentBudget,
  currentMonthTopExpenseCategories,
  currentMonthSummary,
  currentMonthSpent,
  recentThreeMonthExpenses,
  recentThreeMonthExpenseTotal,
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
      <SummaryCards
        :summary="currentMonthSummary"
        :budget="currentBudget?.limit ?? 0"
        :spent="currentMonthSpent"
        :expense-amount="currentMonthSpent"
        :top-expense-categories="currentMonthTopExpenseCategories"
      />
    </section>

    <section class="panel full-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">예산 참고 현황</p>
          <h2>지난 3달 소비 금액</h2>
        </div>
      </div>
      <ThreeMonthExpenseChart
        :items="recentThreeMonthExpenses"
        :total="recentThreeMonthExpenseTotal"
      />
    </section>
  </section>
</template>
