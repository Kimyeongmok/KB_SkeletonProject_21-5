<script setup>
import { computed, ref, watch } from 'vue'
import { useFinanceStore } from '@/stores/finance'
import { formatCurrency } from '@/utils/format'

const financeStore = useFinanceStore()
const today = new Date()
const currentMonth = ref(new Date(today.getFullYear(), today.getMonth(), 1))
const selectedDate = ref(today.toISOString().slice(0, 10))

const monthLabel = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = currentMonth.value.getMonth() + 1
  return `${year}년 ${month}월`
})

const monthKey = computed(() => {
  const year = currentMonth.value.getFullYear()
  const month = String(currentMonth.value.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
})

const monthTransactions = computed(() =>
  financeStore.sortedTransactions.filter((item) => item.date.startsWith(monthKey.value)),
)

const dailyMap = computed(() => {
  const grouped = new Map()

  for (const item of monthTransactions.value) {
    if (!grouped.has(item.date)) {
      grouped.set(item.date, { income: 0, expense: 0, items: [] })
    }

    const target = grouped.get(item.date)
    if (item.type === 'income') target.income += Number(item.amount)
    else target.expense += Number(item.amount)
    target.items.push(item)
  }

  return grouped
})

const calendarDays = computed(() => {
  const firstDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth(), 1)
  const lastDay = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1, 0)
  const startOffset = firstDay.getDay()
  const totalCells = Math.ceil((startOffset + lastDay.getDate()) / 7) * 7

  return Array.from({ length: totalCells }, (_, index) => {
    const dayNumber = index - startOffset + 1
    if (dayNumber < 1 || dayNumber > lastDay.getDate()) {
      return { key: `empty-${index}`, isCurrentMonth: false }
    }

    const date = `${monthKey.value}-${String(dayNumber).padStart(2, '0')}`
    return {
      key: date,
      isCurrentMonth: true,
      date,
      dayNumber,
      summary: dailyMap.value.get(date) ?? { income: 0, expense: 0, items: [] },
      isSelected: selectedDate.value === date,
    }
  })
})

const selectedDaySummary = computed(() => dailyMap.value.get(selectedDate.value) ?? null)

watch(
  monthKey,
  (value) => {
    if (!selectedDate.value.startsWith(value)) selectedDate.value = `${value}-01`
  },
  { immediate: true },
)

function moveMonth(step) {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + step, 1)
}

function selectDate(date) {
  selectedDate.value = date
}
</script>

<template>
  <div class="calendar-layout">
    <div class="calendar-board">
      <div class="calendar-toolbar">
        <button class="secondary-button" type="button" @click="moveMonth(-1)">이전</button>
        <strong>{{ monthLabel }}</strong>
        <button class="secondary-button" type="button" @click="moveMonth(1)">다음</button>
      </div>

      <div class="calendar-weekdays">
        <span>일</span><span>월</span><span>화</span><span>수</span><span>목</span><span>금</span><span>토</span>
      </div>

      <div class="calendar-grid">
        <button
          v-for="day in calendarDays"
          :key="day.key"
          class="calendar-cell"
          :class="{ muted: !day.isCurrentMonth, selected: day.isSelected }"
          type="button"
          :disabled="!day.isCurrentMonth"
          @click="day.isCurrentMonth && selectDate(day.date)"
        >
          <template v-if="day.isCurrentMonth">
            <strong>{{ day.dayNumber }}</strong>
            <span v-if="day.summary.income" class="income-text">+{{ formatCurrency(day.summary.income) }}</span>
            <span v-if="day.summary.expense" class="expense-text">-{{ formatCurrency(day.summary.expense) }}</span>
          </template>
        </button>
      </div>
    </div>

    <aside class="calendar-side">
      <div class="section-heading">
        <div>
          <p class="section-label">선택한 날짜</p>
          <h2>{{ selectedDate }}</h2>
        </div>
      </div>

      <div v-if="selectedDaySummary" class="day-summary">
        <div class="day-metric">
          <span>수입</span>
          <strong class="income-text">{{ formatCurrency(selectedDaySummary.income) }}</strong>
        </div>
        <div class="day-metric">
          <span>지출</span>
          <strong class="expense-text">{{ formatCurrency(selectedDaySummary.expense) }}</strong>
        </div>
      </div>

      <div v-if="selectedDaySummary?.items?.length" class="day-list">
        <article v-for="item in selectedDaySummary.items" :key="item.id" class="day-item">
          <div>
            <strong>{{ item.category }}</strong>
            <p>{{ item.memo || '메모 없음' }}</p>
          </div>
          <span :class="item.type === 'income' ? 'income-text' : 'expense-text'">
            {{ item.type === 'income' ? '+' : '-' }}{{ formatCurrency(item.amount) }}
          </span>
        </article>
      </div>
      <p v-else class="feedback hint">선택한 날짜의 거래 내역이 없습니다.</p>
    </aside>
  </div>
</template>
