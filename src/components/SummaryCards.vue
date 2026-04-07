<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  summary: { type: Object, required: true },
})
</script>

<template>
  <div class="overview-metrics">
    <article class="metric-card">
      <span>예산 진행률</span>
      <div class="metric-bar">
        <div class="metric-fill" :style="{ width: `${Math.max(18, Math.min(100, summary.expense ? 72 : 18))}%` }"></div>
      </div>
      <strong>{{ formatCurrency(summary.expense) }}</strong>
    </article>

    <article class="metric-card donut-metric">
      <span>이번 달 소비 비율</span>
      <div class="mini-donut"></div>
    </article>

    <article class="metric-card">
      <span>저축 목표 달성</span>
      <div class="mini-bars">
        <i></i><i></i><i></i><i></i>
      </div>
      <strong>{{ formatCurrency(summary.balance) }}</strong>
    </article>
  </div>
</template>
