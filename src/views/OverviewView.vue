<script setup>
import MainMenu from '@/components/MainMenu.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/format'

const authStore = useAuthStore()
const financeStore = useFinanceStore()
const { summary } = useFinanceDashboard()

const recentTransactions = financeStore.sortedTransactions.slice(0, 6)
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
        <SummaryCards :summary="summary" />
      </section>

      <section class="panel recent-panel-card">
        <div class="section-heading compact">
          <div>
            <h2>최근 거래 내역</h2>
          </div>
        </div>

        <div class="recent-table">
          <div class="recent-head">
            <span>일시</span>
            <span>상호명</span>
            <span>금액</span>
            <span>구분</span>
          </div>
          <div v-for="item in recentTransactions" :key="item.id" class="recent-row">
            <span>{{ item.date }}</span>
            <span>{{ item.memo || item.category }}</span>
            <strong>{{ formatCurrency(item.amount) }}</strong>
            <em :class="item.type === 'income' ? 'income-text' : 'expense-text'">
              {{ item.category }}
            </em>
          </div>
        </div>
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
