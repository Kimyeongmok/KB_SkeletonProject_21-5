<script setup>
import SummaryCards from '@/components/SummaryCards.vue'
import TransactionFilters from '@/components/TransactionFilters.vue'
import TransactionForm from '@/components/TransactionForm.vue'
import TransactionList from '@/components/TransactionList.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()
const {
  filters,
  categoryOptions,
  filteredTransactions,
  summary,
  handleTransactionSubmit,
} = useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid">
    <TransactionForm class="panel input-panel" @submit-transaction="handleTransactionSubmit" />

    <section class="panel wide-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래 조회</p>
          <h2>필터 조건</h2>
        </div>
      </div>
      <TransactionFilters v-model="filters" :categories="categoryOptions" />
    </section>

    <section class="panel wide-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">조건별 합계</p>
          <h2>수입 / 지출 요약</h2>
        </div>
      </div>
      <SummaryCards :summary="summary" />
    </section>

    <section class="panel full-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">거래 내역</p>
          <h2>기록 목록</h2>
        </div>
        <span class="count-chip">{{ filteredTransactions.length }}건</span>
      </div>

      <p v-if="financeStore.errorMessage" class="feedback error">{{ financeStore.errorMessage }}</p>
      <p v-else-if="financeStore.isLoading" class="feedback hint">데이터를 불러오는 중입니다.</p>
      <TransactionList v-else :items="filteredTransactions" />
    </section>
  </section>
</template>
