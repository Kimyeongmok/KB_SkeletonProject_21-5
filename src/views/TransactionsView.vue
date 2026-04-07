<script setup>
import AiFinanceInsight from '@/components/AiFinanceInsight.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import TransactionFilters from '@/components/TransactionFilters.vue'
import TransactionList from '@/components/TransactionList.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()
const {
  filters,
  categoryOptions,
  filteredTransactions,
  currentBudget,
  currentMonthSummary,
  currentMonthSpent,
  currentMonthTopExpenseCategories,
  summary,
  handleTransactionDelete,
} = useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid">
    <section class="panel half-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래관리</p>
          <h2>수입 / 지출 요약</h2>
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

    <section class="panel half-panel">
      <AiFinanceInsight
        :summary="summary"
        :budget="currentBudget?.limit ?? 0"
        :spent="currentMonthSpent"
        :items="filteredTransactions"
      />
    </section>

    <section class="panel full-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래내역</p>
          <h2>기록 조회</h2>
        </div>
        <span class="count-chip">{{ filteredTransactions.length }}건</span>
      </div>

      <div class="transaction-history-filters">
        <TransactionFilters v-model="filters" :categories="categoryOptions" />
      </div>

      <p v-if="financeStore.errorMessage" class="feedback error">{{ financeStore.errorMessage }}</p>
      <p v-else-if="financeStore.isLoading" class="feedback hint">데이터를 불러오는 중입니다.</p>
      <TransactionList
        v-else
        :items="filteredTransactions"
        @delete-transaction="handleTransactionDelete"
      />
    </section>
  </section>
</template>
