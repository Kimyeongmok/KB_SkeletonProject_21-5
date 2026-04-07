<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  summary: { type: Object, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  expenseAmount: { type: Number, default: null },
  topExpenseCategories: { type: Array, default: () => [] },
})

const bonobonoImageUrl = new URL('../../보노보노.jpg', import.meta.url).href
const greatImageUrl = new URL('../../정말대단해.png', import.meta.url).href
const overBudgetImageUrl = new URL('../../초과.png', import.meta.url).href

const budgetProgress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return 0
  }

  return Math.round((Number(props.spent) / Number(props.budget)) * 100)
})

const budgetProgressBarWidth = computed(() => Math.min(100, Math.max(0, budgetProgress.value)))

const budgetImageUrl = computed(() => {
  if (budgetProgress.value <= 30) {
    return greatImageUrl
  }

  if (budgetProgress.value > 100) {
    return overBudgetImageUrl
  }

  return bonobonoImageUrl
})

const budgetLabel = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return '예산 미설정'
  }

  return `${budgetProgress.value}%`
})

const bonobonoStyle = computed(() => {
  if (budgetProgress.value <= 30) {
    return {
      opacity: 1,
      filter: 'grayscale(0) blur(0) saturate(1) contrast(1)',
    }
  }

  if (budgetProgress.value > 100) {
    return {
      opacity: 1,
      filter: 'grayscale(0) blur(0) saturate(1) contrast(1)',
    }
  }

  return {
    opacity: 1,
    filter: 'grayscale(0) blur(0) saturate(1) contrast(1)',
  }
})

const glowActive = computed(() => budgetProgress.value > 30 && budgetProgress.value <= 100)

const glowStyle = computed(() => {
  if (!glowActive.value) {
    return {}
  }

  const strength = (budgetProgress.value - 30) / 70

  return {
    opacity: 0.08 + strength * 0.92,
    transform: `scale(${0.84 + strength * 0.16})`,
  }
})

const displayedExpenseAmount = computed(() =>
  props.expenseAmount === null ? Number(props.summary.expense || 0) : Number(props.expenseAmount || 0),
)

const topExpenseCategoryColors = ['#2563eb', '#ef4444', '#f59e0b']

const donutGradient = computed(() => {
  const totalExpense = displayedExpenseAmount.value

  if (!totalExpense || !props.topExpenseCategories.length) {
    return 'conic-gradient(rgba(148, 163, 184, 0.28) 0deg 360deg)'
  }

  let startAngle = 0
  const segments = props.topExpenseCategories.map((item, index) => {
    const ratio = Number(item.amount || 0) / totalExpense
    const angle = ratio * 360
    const color = topExpenseCategoryColors[index % topExpenseCategoryColors.length]
    const segment = `${color} ${startAngle}deg ${startAngle + angle}deg`
    startAngle += angle
    return segment
  })

  if (startAngle < 360) {
    segments.push(`rgba(148, 163, 184, 0.24) ${startAngle}deg 360deg`)
  }

  return `conic-gradient(${segments.join(', ')})`
})
</script>

<template>
  <div class="overview-metrics">
    <article class="metric-card bonobono-card">
      <span>예산 진행률</span>

      <div class="bonobono-stage">
        <div class="bonobono-figure">
          <img class="bonobono-image" :src="budgetImageUrl" alt="보노보노" :style="bonobonoStyle" />
          <div v-if="glowActive" class="bonobono-glow" :style="glowStyle">
            <!-- <i class="left-eye"></i>
            <i class="right-eye"></i> -->
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
      <div class="mini-donut" :style="{ background: donutGradient }"></div>
      <strong>{{ formatCurrency(displayedExpenseAmount) }}</strong>
      <div v-if="topExpenseCategories.length" class="metric-top-list">
        <div
          v-for="(item, index) in topExpenseCategories"
          :key="item.category"
          class="metric-top-item"
        >
          <span
            class="metric-top-dot"
            :style="{ backgroundColor: topExpenseCategoryColors[index % topExpenseCategoryColors.length] }"
          ></span>
          <div
            class="metric-top-copy"
            :style="{ color: topExpenseCategoryColors[index % topExpenseCategoryColors.length] }"
          >
            <strong>{{ item.category }} {{ item.percent }}%</strong>
            <span>{{ formatCurrency(item.amount) }}</span>
          </div>
        </div>
      </div>
      <small v-else>해당 달 소비 카테고리 TOP3가 없습니다.</small>
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
