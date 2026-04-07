<script setup>
import MainMenu from '@/components/MainMenu.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import SummaryCards from '@/components/SummaryCards.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'
import { useFinanceStore } from '@/stores/finance'

const financeStore = useFinanceStore()
const { currentMonth, currentMonthChartData, summary } = useFinanceDashboard()
</script>

<template>
  <section class="dashboard-grid">
    <section class="panel overview-chart-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">이번 달 차트</p>
          <h2>수입 / 지출 원형 그래프</h2>
        </div>
      </div>
      <MonthlySummaryTable :month="currentMonth" :items="currentMonthChartData" />
    </section>

    <MainMenu class="panel menu-panel" />

    <section class="panel wide-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">현재 현황</p>
          <h2>조건별 합계</h2>
        </div>
      </div>
      <SummaryCards :summary="summary" />
    </section>

    <section class="panel wide-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">안내</p>
          <h2>메뉴 버튼으로 기능 이동</h2>
        </div>
      </div>
      <p class="feedback hint">
        거래 관리에서는 기록 등록과 조회를 처리하고, 소비 달력에서는 날짜별 수입과 지출 및 상세 내역을 확인할 수 있습니다.
      </p>
      <p v-if="financeStore.errorMessage" class="feedback error">{{ financeStore.errorMessage }}</p>
    </section>
  </section>
</template>
