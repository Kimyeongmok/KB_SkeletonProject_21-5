<script setup>
import Bonobono from '@/components/Bonobono.vue'
import BudgetCard from '@/components/BudgetCard.vue'
import RecentTransaction from '@/components/RecentTransaction.vue'
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
      <Bonobono
        :summary="currentMonthSummary"
        :budget="currentBudget?.limit ?? 0"
        :spent="currentMonthSpent"
        :expense-amount="currentMonthSpent"
        :top-expense-categories="currentMonthTopExpenseCategories"
      />
    </section>

    <section class="panel full-panel">
      <RecentTransaction :items="recentThreeMonthExpenses" :total="recentThreeMonthExpenseTotal" />
    </section>
  </section>
</template>
