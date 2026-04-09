<template>
  <section class="calendar-card">
    <header class="calendar-header">
      <button type="button" class="month-btn" @click="emit('change-month', -1)">
        이전
      </button>
      <h2 class="month-title">{{ monthLabel }}</h2>
      <button type="button" class="month-btn" @click="emit('change-month', 1)">
        다음
      </button>
    </header>

    <div class="weekdays">
      <span v-for="day in weekdays" :key="day">{{ day }}</span>
    </div>

    <div class="calendar-grid">
      <button
        v-for="cell in calendarCells"
        :key="cell.key"
        type="button"
        class="day-cell"
        :class="{
          'is-other-month': !cell.isCurrentMonth,
          'is-selected': cell.dateString === selectedDate,
          'is-today': cell.dateString === todayString,
        }"
        @click="handleSelectDate(cell)"
      >
        <span class="day-number">{{ cell.date.getDate() }}</span>
        <div class="day-amounts">
          <span class="income">{{ formatIncomeAmount(cell.incomeTotal) }}</span>
          <span class="expense">{{
            formatExpenseAmount(cell.expenseTotal)
          }}</span>
        </div>
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  selectedMonth: {
    type: Date,
    required: true,
  },
  selectedDate: {
    type: String,
    required: true,
  },
  transactions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['select-date', 'change-month']);

const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const todayString = toDateString(new Date());

const monthLabel = computed(() => {
  const year = props.selectedMonth.getFullYear();
  const month = String(props.selectedMonth.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

const totalsByDate = computed(() => {
  const map = new Map();

  for (const item of props.transactions) {
    if (!item?.date) continue;

    const current = map.get(item.date) || { income: 0, expense: 0 };
    const amount = Number(item.amount) || 0;

    if (item.type === 'income') {
      current.income += amount;
    } else if (item.type === 'expense') {
      current.expense += amount;
    }

    map.set(item.date, current);
  }

  return map;
});

const calendarCells = computed(() => {
  const firstDay = new Date(
    props.selectedMonth.getFullYear(),
    props.selectedMonth.getMonth(),
    1,
  );
  const startOffset = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(firstDay.getDate() - startOffset);

  return Array.from({ length: 42 }).map((_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);

    const dateString = toDateString(date);
    const dayTotal = totalsByDate.value.get(dateString) || {
      income: 0,
      expense: 0,
    };

    return {
      key: `${dateString}-${index}`,
      date,
      dateString,
      incomeTotal: dayTotal.income,
      expenseTotal: dayTotal.expense,
      isCurrentMonth: date.getMonth() === props.selectedMonth.getMonth(),
    };
  });
});

function handleSelectDate(cell) {
  if (!cell.isCurrentMonth) return;
  emit('select-date', cell.dateString);
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatTinyAmount(amount) {
  if (!amount) return '-';
  return `${Math.round(amount).toLocaleString()}`;
}

function formatIncomeAmount(amount) {
  if (!amount) return '-';
  return `+${formatTinyAmount(amount)}`;
}

function formatExpenseAmount(amount) {
  if (!amount) return '-';
  return `-${formatTinyAmount(amount)}`;
}
</script>

<style scoped>
.calendar-card {
  border: 1px solid #d2d8df;
  border-radius: 20px;
  background: #ffffff;
  padding: 18px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.month-title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 800;
  color: #1f2937;
}

.month-btn {
  border: 1px solid #d1d5db;
  border-radius: 999px;
  padding: 6px 12px;
  background: #f9fafb;
  color: #111827;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  text-align: center;
  color: #8b94a5;
  font-weight: 700;
  margin-bottom: 6px;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
}

.day-cell {
  border: 0;
  border-radius: 12px;
  min-height: 72px;
  padding: 6px 4px;
  background: transparent;
  color: #2f3640;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  cursor: pointer;
}

.day-cell:hover {
  background: #f5f7fa;
}

.day-number {
  font-size: 1rem;
  font-weight: 700;
  line-height: 1.1;
}

.day-amounts {
  margin-top: 3px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
  font-size: 0.74rem;
  font-weight: 700;
}

.income {
  color: #dc2626;
}

.expense {
  color: #2563eb;
}

.is-other-month {
  color: #c0c6d1;
}

.is-other-month .income,
.is-other-month .expense {
  color: #cfd5df;
}

.is-today {
  box-shadow: inset 0 0 0 1px #93c5fd;
}

.is-selected {
  background: #2f2f35;
}

.is-selected .day-number {
  color: #ffffff;
}

.is-selected .income {
  color: #ff8a8a;
}

.is-selected .expense {
  color: #87b6ff;
}

@media (max-width: 760px) {
  .day-cell {
    min-height: 64px;
  }

  .day-number {
    font-size: 0.95rem;
  }

  .day-amounts {
    font-size: 0.67rem;
  }
}
</style>
