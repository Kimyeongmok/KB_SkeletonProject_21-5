<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  summary: { type: Object, required: true },
  title: { type: String, default: '이번 달 진행 현황' },
  subtitle: { type: String, default: '입력 전 확인' },
})

const netProfit = computed(() => Number(props.summary.income || 0) - Number(props.summary.expense || 0))
</script>

<template>
  <section class="panel monthly-status-panel">
    <div class="section-heading compact">
      <div>
        <p class="section-label">{{ title }}</p>
        <h2>{{ subtitle }}</h2>
      </div>
    </div>

    <div class="monthly-status-cards">
      <article class="metric-card monthly-status-card">
        <span>수입 금액</span>
        <strong class="income-text">{{ formatCurrency(summary.income || 0) }}</strong>
      </article>

      <article class="metric-card monthly-status-card">
        <span>소비 금액</span>
        <strong class="expense-text">{{ formatCurrency(summary.expense || 0) }}</strong>
      </article>

      <article class="metric-card monthly-status-card">
        <span>순이익</span>
        <strong :class="netProfit >= 0 ? 'income-text' : 'expense-text'">
          {{ netProfit >= 0 ? '+' : '' }}{{ formatCurrency(netProfit) }}
        </strong>
      </article>
    </div>
  </section>
</template>
