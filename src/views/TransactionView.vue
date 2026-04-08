<script setup>
import CurrentBudget from '@/components/CurrentBudget.vue'
import BalanceIO from '@/components/BalanceIO.vue'
import Summary from '@/components/Summary.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const { currentBudget, currentMonthSummary, currentMonthSpent, handleTransactionSubmit } =
  useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid manage-page-grid">
    <section class="full-panel">
      <CurrentBudget :budget="currentBudget?.limit ?? 0" :spent="currentMonthSpent" />
    </section>

    <section class="panel half-panel manage-form-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래관리</p>
          <h2>거래내역 추가</h2>
        </div>
      </div>
      <BalanceIO @submit-transaction="handleTransactionSubmit" />
    </section>

    <section class="half-panel">
      <Summary :summary="currentMonthSummary" />
    </section>
  </section>
</template>
