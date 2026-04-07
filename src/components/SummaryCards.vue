<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  summary: { type: Object, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const budgetProgress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return 0
  }

  return Math.min(100, Math.round((Number(props.spent) / Number(props.budget)) * 100))
})

const budgetLabel = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return '예산 미설정'
  }

  return `${budgetProgress.value}%`
})
</script>

<template>
  <div class="overview-metrics">
    <article class="metric-card">
      <span>예산 진행률</span>
      <div class="metric-bar">
        <div class="metric-fill" :style="{ width: `${budgetProgress}%` }"></div>
      </div>
      <strong>{{ budgetLabel }}</strong>
      <small>{{ budget ? `${formatCurrency(spent)} / ${formatCurrency(budget)}` : '예산을 먼저 저장하세요' }}</small>
    </article>

    <article class="metric-card donut-metric">
      <span>이번 달 소비 비율</span>
      <div class="mini-donut"></div>
      <strong>{{ formatCurrency(summary.expense) }}</strong>
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
