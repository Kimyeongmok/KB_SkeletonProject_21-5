<template>
  <section class="summary-card" v-if="isLoaded">
    <h2 class="summary-title">이번 달 수입 / 소비</h2>

    <div class="summary-grid">
      <article class="amount-item amount-item-income">
        <p class="amount-label">수입 금액</p>
        <p class="amount-value income">{{ formatCurrency(totalIncome) }}</p>
      </article>

      <article class="amount-item amount-item-expense">
        <p class="amount-label">소비 금액</p>
        <p class="amount-value expense">{{ formatCurrency(totalExpense) }}</p>
      </article>

      <article class="amount-item" :class="netAmountItemClass">
        <p class="amount-label">순 이익</p>
        <p class="amount-value" :class="netProfitClass">
          {{ formatCurrency(netProfit) }}
        </p>
      </article>
    </div>
  </section>

  <div v-else class="loading-state">데이터를 불러오는 중...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

const dbData = ref(null);
const isLoaded = ref(false);
const apiBaseUrl = 'http://localhost:3000';
const currentUserId = 'user-001';
const currentMonth = new Date().toISOString().slice(0, 7);

onMounted(async () => {
  try {
    const response = await fetch(`${apiBaseUrl}/finances`);
    dbData.value = { finances: await response.json() };
    isLoaded.value = true;
  } catch (error) {
    console.error('요약 데이터를 불러오지 못했습니다:', error);
  }
});

const currentMonthFinances = computed(() => {
  if (!dbData.value?.finances) return [];

  return dbData.value.finances.filter(
    (item) =>
      item.userId === currentUserId && item.date.startsWith(currentMonth),
  );
});

const totalIncome = computed(() => {
  return currentMonthFinances.value
    .filter((item) => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
});

const totalExpense = computed(() => {
  return currentMonthFinances.value
    .filter((item) => item.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);
});

const netProfit = computed(() => totalIncome.value - totalExpense.value);

const netProfitClass = computed(() => {
  if (netProfit.value > 0) return 'net-positive';
  if (netProfit.value < 0) return 'net-negative';
  return 'net-neutral';
});

const netAmountItemClass = computed(() => {
  if (netProfit.value > 0) return 'amount-item-net-positive';
  if (netProfit.value < 0) return 'amount-item-net-negative';
  return 'amount-item-net-neutral';
});

const formatCurrency = (amount) => `₩ ${amount.toLocaleString()}`;
</script>

<style scoped>
.summary-card {
  background: #ffffff;
  border: 1px solid #cfd7df;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(71, 95, 114, 0.14);
  padding: 18px 20px 22px;
}

.summary-title {
  font-size: 20px;
  font-weight: 800;
  color: #121212;
  margin-bottom: 18px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.amount-item {
  background: #f3ebed;
  border: 1px solid #d8cfd3;
  border-radius: 14px;
  padding: 10px 16px;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
}

.amount-item-income {
  background: #ffe8e8;
  border-color: #f1c8c8;
}

.amount-item-expense {
  background: #e9f1ff;
  border-color: #c9daf8;
}

.amount-item-net-positive {
  background: #ffe8e8;
  border-color: #f1c8c8;
}

.amount-item-net-negative {
  background: #e9f1ff;
  border-color: #c9daf8;
}

.amount-item-net-neutral {
  background: #f3ebed;
  border-color: #d8cfd3;
}

.amount-label {
  margin: 0;
  font-size: 0.95rem;
  color: #111;
}

.amount-value {
  margin: 4px 0 0;
  font-size: 1.2rem;
  font-weight: 800;
  line-height: 1.2;
}

.income {
  color: #ff0000;
}

.expense {
  color: #1a24ff;
}

.net-positive {
  color: #ff0000;
}

.net-negative {
  color: #1a24ff;
}

.net-neutral {
  color: #000000;
}

.loading-state {
  padding: 14px;
  color: #666;
}

@media (max-width: 900px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .amount-value {
    font-size: 1.6rem;
  }
}
</style>
