<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  month: { type: String, required: true },
  budget: { type: Number, default: 0 },
  income: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const budgetProgress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return null
  }

  return Math.round((Number(props.spent) / Number(props.budget)) * 100)
})

const budgetProgressBarWidth = computed(() => {
  if (budgetProgress.value === null) {
    return 0
  }

  return Math.min(100, Math.max(0, budgetProgress.value))
})
</script>

<template>
  <section class="monthly-progress">
    <div class="section-heading compact">
      <div>
        <p class="section-label">이번 달 진행 현황</p>
        <h2>{{ month }} 설정 요약</h2>
      </div>
    </div>

    <div class="monthly-progress-grid">
      <article class="progress-stat-card">
        <span>이번 달 설정 예산</span>
        <strong>{{ budget ? formatCurrency(budget) : '미설정' }}</strong>
        <template v-if="budgetProgress !== null">
          <div class="metric-bar">
            <div class="metric-fill" :style="{ width: `${budgetProgressBarWidth}%` }"></div>
          </div>
          <strong class="progress-rate">{{ budgetProgress }}%</strong>
          <small>{{ formatCurrency(spent) }} / {{ formatCurrency(budget) }}</small>
        </template>
        <small v-else>예산관리에서 먼저 설정해 주세요.</small>
      </article>

      <article class="progress-stat-card">
        <span>수입 금액</span>
        <strong class="income-text">{{ formatCurrency(income) }}</strong>
        <small>이번 달에 기록된 전체 수입입니다.</small>
      </article>

      <article class="progress-stat-card">
        <span>소비 금액</span>
        <strong class="expense-text">{{ formatCurrency(spent) }}</strong>
        <small>이번 달에 기록된 전체 소비입니다.</small>
      </article>
    </div>
  </section>
</template>
