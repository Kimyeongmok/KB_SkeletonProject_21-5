<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const progress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return 0
  }

  return Math.round((Number(props.spent) / Number(props.budget)) * 100)
})

const progressWidth = computed(() => Math.min(100, Math.max(0, progress.value)))

const currentLabel = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return '예산 미설정'
  }

  return `${formatCurrency(props.spent)} / ${formatCurrency(props.budget)}`
})
</script>

<template>
  <section class="panel budget-progress-banner">
    <div class="budget-progress-banner-labels">
      <strong>이번달 설정 금액</strong>
      <span>{{ currentLabel }}</span>
    </div>

    <div class="budget-progress-banner-track">
      <div class="budget-progress-banner-fill" :style="{ width: `${progressWidth}%` }"></div>
      <span class="budget-progress-banner-value">{{ progress }}%</span>
    </div>
  </section>
</template>
