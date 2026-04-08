<script setup>
import BudgetProgressBanner from '@/components/BudgetProgressBanner.vue'
import MonthlyStatusCards from '@/components/MonthlyStatusCards.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const { currentBudget, currentMonthSummary, currentMonthSpent, handleTransactionSubmit } =
  useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid manage-page-grid">
    <section class="full-panel">
      <BudgetProgressBanner
        :budget="currentBudget?.limit ?? 0"
        :spent="currentMonthSpent"
      />
    </section>

    <section class="panel half-panel manage-form-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래관리</p>
          <h2>거래내역 추가</h2>
        </div>
      </div>
      <TransactionForm @submit-transaction="handleTransactionSubmit" />
    </section>

    <section class="half-panel">
      <MonthlyStatusCards :summary="currentMonthSummary" />
    </section>
  </section>
</template>
