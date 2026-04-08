<script setup>
import CurrentBudget from '@/components/CurrentBudget.vue'
import Summary from '@/components/Summary.vue'
import MonthlySummaryTable from '@/components/MonthlySummaryTable.vue'
import { useFinanceDashboard } from '@/composables/useFinanceDashboard'

const { currentMonth, currentMonthChartData, currentBudget, currentMonthSpent, currentMonthSummary } =
  useFinanceDashboard()
</script>

<template>
  <section class="overview-main">
    <CurrentBudget :budget="currentBudget?.limit ?? 0" :spent="currentMonthSpent" />

    <Summary :summary="currentMonthSummary" title="이번 달 진행 현황" subtitle="이번 달 요약" />

    <section class="panel recent-panel-card">
      <div class="section-heading compact">
        <div>
          <h2>수입 / 소비 그래프</h2>
        </div>
        <span class="count-chip">{{ currentMonth }}</span>
      </div>

      <MonthlySummaryTable :month="currentMonth" :items="currentMonthChartData" />
    </section>
  </section>
</template>
