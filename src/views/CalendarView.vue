<template>
  <div class="calendar-view">
    <div class="calendar-layout">
      <Calendar
        :selected-month="selectedMonth"
        :selected-date="selectedDate"
        :transactions="transactions"
        @select-date="handleSelectDate"
        @change-month="handleChangeMonth"
      />

      <DailyTransaction
        :selected-month="selectedMonth"
        :selected-date="selectedDate"
        :transactions="transactions"
      />

      <p v-if="isLoading" class="feedback">거래 데이터를 불러오는 중입니다.</p>
      <p v-if="errorMessage" class="feedback error">{{ errorMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import Calendar from '@/components/Calendar.vue';
import DailyTransaction from '@/components/DailyTransaction.vue';

const apiBaseUrl = 'http://localhost:3000';
const currentUserId = 'user-001';

const selectedMonth = ref(
  new Date(new Date().getFullYear(), new Date().getMonth(), 1),
);
const selectedDate = ref(toDateString(new Date()));
const transactions = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const selectedMonthKey = computed(() => {
  const year = selectedMonth.value.getFullYear();
  const month = String(selectedMonth.value.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

onMounted(() => {
  loadTransactions();
});

async function loadTransactions() {
  isLoading.value = true;

  try {
    const response = await fetch(
      `${apiBaseUrl}/finances?userId=${currentUserId}`,
    );
    const data = await response.json();
    transactions.value = Array.isArray(data) ? data : [];
    errorMessage.value = '';

    const today = new Date();
    if (isSameMonth(selectedMonth.value, today)) {
      selectedDate.value = toDateString(today);
    } else {
      selectedDate.value = getDefaultDateForMonth(
        selectedMonth.value,
        transactions.value,
      );
    }
  } catch (error) {
    transactions.value = [];
    errorMessage.value = '거래 데이터를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

function handleSelectDate(dateString) {
  selectedDate.value = dateString;
}

function handleChangeMonth(delta) {
  const nextMonth = new Date(selectedMonth.value);
  nextMonth.setMonth(nextMonth.getMonth() + delta);
  nextMonth.setDate(1);

  selectedMonth.value = nextMonth;
  selectedDate.value = getDefaultDateForMonth(nextMonth, transactions.value);
}

function getDefaultDateForMonth(monthDate, items) {
  const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;

  const matched = items
    .filter((item) => item?.date?.startsWith(monthKey))
    .sort((a, b) => toTimestamp(b) - toTimestamp(a));

  if (matched.length) {
    return matched[0].date;
  }

  return `${monthKey}-01`;
}

function toTimestamp(item) {
  const safeDate = item?.date || '1970-01-01';
  const safeTime = item?.time || '00:00';
  return new Date(`${safeDate}T${safeTime}:00`).getTime();
}

function toDateString(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isSameMonth(left, right) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  );
}
</script>

<style scoped>
.calendar-view {
  min-height: 100vh;
  background: #f3f6fa;
  padding: 22px 14px;
}

.calendar-layout {
  width: min(920px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 14px;
}

.feedback {
  margin: 0;
  font-size: 0.9rem;
  color: #4b5563;
}

.feedback.error {
  color: #b91c1c;
}

@media (max-width: 760px) {
  .calendar-view {
    padding: 16px 10px;
  }
}
</style>
