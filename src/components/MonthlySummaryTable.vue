<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  month: { type: String, required: true },
  items: { type: Array, default: () => [] },
})

const palette = ['#0471e9', '#00bfa5', '#00aacc', '#feda4a', '#7dd3fc', '#8de4d4']
const incomeItems = computed(() => props.items.filter((item) => item.type === 'income'))
const expenseItems = computed(() => props.items.filter((item) => item.type === 'expense'))

function buildChartSegments(items) {
  const total = items.reduce((sum, item) => sum + Number(item.amount), 0)

  if (!total) {
    return { total: 0, segments: [], gradient: 'conic-gradient(#e2e8f0 0deg 360deg)' }
  }

  let startAngle = 0
  const segments = items.map((item, index) => {
    const value = Number(item.amount)
    const ratio = value / total
    const angle = ratio * 360
    const color = palette[index % palette.length]
    const segment = {
      ...item,
      color,
      percent: Math.round(ratio * 100),
      startAngle,
      endAngle: startAngle + angle,
    }
    startAngle += angle
    return segment
  })

  return {
    total,
    segments,
    gradient: `conic-gradient(${segments
      .map((segment) => `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`)
      .join(', ')})`,
  }
}

const incomeChart = computed(() => buildChartSegments(incomeItems.value))
const expenseChart = computed(() => buildChartSegments(expenseItems.value))
</script>

<template>
  <div class="chart-board">
    <article class="chart-card">
      <div class="chart-header">
        <div>
          <p class="section-label">이번 달 수입</p>
          <h3>{{ month }}</h3>
        </div>
        <strong>{{ formatCurrency(incomeChart.total) }}</strong>
      </div>
      <div v-if="incomeChart.total" class="chart-body">
        <div class="donut-wrap">
          <div class="donut-chart" :style="{ background: incomeChart.gradient }">
            <div class="donut-hole">
              <span>수입</span>
              <strong>{{ formatCurrency(incomeChart.total) }}</strong>
            </div>
          </div>
        </div>
        <div class="chart-legend">
          <div v-for="segment in incomeChart.segments" :key="segment.category" class="legend-item">
            <span class="legend-dot" :style="{ backgroundColor: segment.color }"></span>
            <div class="legend-copy">
              <strong>{{ segment.category }} {{ segment.percent }}%</strong>
              <span>{{ formatCurrency(segment.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="feedback hint">이번 달 수입 데이터가 없습니다.</p>
    </article>

    <article class="chart-card">
      <div class="chart-header">
        <div>
          <p class="section-label">이번 달 지출</p>
          <h3>{{ month }}</h3>
        </div>
        <strong>{{ formatCurrency(expenseChart.total) }}</strong>
      </div>
      <div v-if="expenseChart.total" class="chart-body">
        <div class="donut-wrap">
          <div class="donut-chart" :style="{ background: expenseChart.gradient }">
            <div class="donut-hole">
              <span>지출</span>
              <strong>{{ formatCurrency(expenseChart.total) }}</strong>
            </div>
          </div>
        </div>
        <div class="chart-legend">
          <div v-for="segment in expenseChart.segments" :key="segment.category" class="legend-item">
            <span class="legend-dot" :style="{ backgroundColor: segment.color }"></span>
            <div class="legend-copy">
              <strong>{{ segment.category }} {{ segment.percent }}%</strong>
              <span>{{ formatCurrency(segment.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="feedback hint">이번 달 지출 데이터가 없습니다.</p>
    </article>
  </div>
</template>
