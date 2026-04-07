<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  summary: { type: Object, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const bonobonoImageUrl = new URL('../../보노보노.jpg', import.meta.url).href

const budgetProgress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return 0
  }

  return Math.round((Number(props.spent) / Number(props.budget)) * 100)
})

const budgetProgressBarWidth = computed(() => Math.min(100, Math.max(0, budgetProgress.value)))

const budgetLabel = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return '예산 미설정'
  }

  return `${budgetProgress.value}%`
})

const bonobonoStyle = computed(() => {
  const ratio = budgetProgress.value / 100

  return {
    opacity: 0.2 + ratio * 0.8,
    filter: `grayscale(${1 - ratio}) blur(${(1 - ratio) * 3}px) saturate(${0.55 + ratio * 0.85}) contrast(${0.85 + ratio * 0.35})`,
  }
})

const glowActive = computed(() => budgetProgress.value >= 70)
</script>

<template>
  <div class="overview-metrics">
    <article class="metric-card bonobono-card">
      <span>예산 진행률</span>

      <div class="bonobono-stage">
        <div class="bonobono-figure">
          <img class="bonobono-image" :src="bonobonoImageUrl" alt="보노보노" :style="bonobonoStyle" />
          <div v-if="glowActive" class="bonobono-glow">
            <i class="left-eye"></i>
            <i class="right-eye"></i>
          </div>
        </div>
      </div>

      <div class="metric-bar">
        <div class="metric-fill" :style="{ width: `${budgetProgressBarWidth}%` }"></div>
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
