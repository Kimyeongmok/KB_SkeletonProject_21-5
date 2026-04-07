<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  summary: { type: Object, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
  items: { type: Array, default: () => [] },
})

const budgetProgress = computed(() => {
  if (!props.budget || props.budget <= 0) {
    return null
  }

  return Math.round((Number(props.spent) / Number(props.budget)) * 100)
})

const topExpenseCategory = computed(() => {
  const expenseMap = new Map()

  for (const item of props.items) {
    if (item.type !== 'expense') {
      continue
    }

    const amount = Number(item.amount) || 0
    expenseMap.set(item.category, (expenseMap.get(item.category) || 0) + amount)
  }

  return Array.from(expenseMap.entries())
    .sort((a, b) => b[1] - a[1])[0] ?? null
})

const insight = computed(() => {
  if (!props.items.length) {
    return {
      tone: 'neutral',
      title: '분석할 거래가 없습니다',
      summary: '현재 필터 조건에 맞는 거래가 없어 수입/지출 패턴을 아직 해석할 수 없습니다.',
      points: ['필터를 넓히면 더 정확한 분석을 볼 수 있습니다.'],
    }
  }

  if (budgetProgress.value !== null && budgetProgress.value > 100) {
    return {
      tone: 'danger',
      title: '지출이 예산을 초과했습니다',
      summary: `이번 달 지출이 설정 예산보다 ${budgetProgress.value - 100}% 많습니다.`,
      points: [
        topExpenseCategory.value
          ? `${topExpenseCategory.value[0]} 지출이 ${formatCurrency(topExpenseCategory.value[1])}로 가장 큽니다.`
          : '지출 카테고리 비중을 점검해 보세요.',
        '당장 줄일 수 있는 고정지출과 반복지출을 먼저 확인하는 편이 좋습니다.',
      ],
    }
  }

  if (props.summary.balance < 0) {
    return {
      tone: 'danger',
      title: '현재 조건에서는 지출 우세입니다',
      summary: `수입보다 지출이 ${formatCurrency(Math.abs(props.summary.balance))} 더 많습니다.`,
      points: [
        topExpenseCategory.value
          ? `${topExpenseCategory.value[0]} 항목의 비중이 가장 큽니다.`
          : '지출 카테고리별 편차를 확인해 보세요.',
        '다음 기록 전까지는 변동지출을 줄이는 쪽이 안전합니다.',
      ],
    }
  }

  if (budgetProgress.value !== null && budgetProgress.value >= 85) {
    return {
      tone: 'warn',
      title: '예산 한도에 가까워졌습니다',
      summary: `이번 달 예산의 ${budgetProgress.value}%를 사용했습니다.`,
      points: [
        '남은 기간 동안 추가 지출을 보수적으로 관리하는 편이 좋습니다.',
        topExpenseCategory.value
          ? `현재 가장 큰 지출 카테고리는 ${topExpenseCategory.value[0]}입니다.`
          : '가장 큰 지출 카테고리를 우선 점검해 보세요.',
      ],
    }
  }

  return {
    tone: 'good',
    title: '수입과 지출 흐름이 안정적입니다',
    summary: `현재 조건 기준 잔액은 ${formatCurrency(props.summary.balance)}입니다.`,
    points: [
      budgetProgress.value !== null
        ? `이번 달 예산 사용률은 ${budgetProgress.value}%입니다.`
        : '예산을 설정하면 월간 소비 속도를 함께 분석할 수 있습니다.',
      topExpenseCategory.value
        ? `${topExpenseCategory.value[0]} 지출을 계속 추적하면 흐름을 유지하기 좋습니다.`
        : '카테고리별 기록이 쌓이면 더 구체적인 분석이 가능합니다.',
    ],
  }
})
</script>

<template>
  <section class="analysis-panel">
    <div class="analysis-kicker">AI 수입/지출 분석</div>
    <strong class="analysis-title" :class="`tone-${insight.tone}`">{{ insight.title }}</strong>
    <p class="analysis-summary">{{ insight.summary }}</p>

    <div class="analysis-stats">
      <div>
        <span>조건별 수입</span>
        <strong>{{ formatCurrency(summary.income) }}</strong>
      </div>
      <div>
        <span>조건별 지출</span>
        <strong>{{ formatCurrency(summary.expense) }}</strong>
      </div>
      <div>
        <span>예산 진행률</span>
        <strong>{{ budgetProgress === null ? '미설정' : `${budgetProgress}%` }}</strong>
      </div>
    </div>

    <ul class="analysis-points">
      <li v-for="point in insight.points" :key="point">{{ point }}</li>
    </ul>
  </section>
</template>
