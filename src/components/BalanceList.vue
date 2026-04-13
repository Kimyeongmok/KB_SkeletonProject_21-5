<template>
  <section class="transaction-panel">
    <div class="section-head section-head--list">
      <h2>거래 내역</h2>
      <p class="result-count">{{ filteredTransactions.length }}건</p>
    </div>

    <div class="filter-toolbar">
      <div class="filter-row">
        <select v-model="typeFilter" class="filter-select">
          <option
            v-for="option in typeOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>

        <select v-model="categoryFilter" class="filter-select">
          <option value="all">전체 카테고리</option>
          <option
            v-for="category in categories"
            :key="category"
            :value="category"
          >
            {{ category }}
          </option>
        </select>

        <div class="date-range-filter">
          <span class="date-range-filter__label">기간</span>
          <input
            v-model="startDateFilter"
            type="date"
            class="date-range-filter__input"
          />
          <span class="date-range-filter__separator">~</span>
          <input
            v-model="endDateFilter"
            type="date"
            class="date-range-filter__input"
          />
          <button
            type="button"
            class="date-range-filter__reset"
            @click="resetDateFilter"
          >
            초기화
          </button>
        </div>
      </div>

      <label class="search-field">
        <span class="search-field__label">검색</span>
        <input
          v-model.trim="searchQuery"
          type="text"
          class="search-field__input"
          placeholder="메모, 카테고리, 금액으로 검색"
        />
      </label>
    </div>

    <div v-if="errorMessage" class="status-message status-message--error">
      {{ errorMessage }}
    </div>
    <div v-else-if="!isLoaded" class="status-message">
      거래 내역을 불러오는 중입니다.
    </div>
    <div v-else-if="filteredTransactions.length === 0" class="status-message">
      조건에 맞는 거래가 없습니다.
    </div>

    <ul v-else class="transaction-list">
      <li
        v-for="transaction in filteredTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-item__left">
          <span
            class="transaction-badge"
            :style="
              transaction.type === 'income'
                ? { background: '#fee2e2', color: '#dc2626' }
                : { background: '#dbeafe', color: '#2563eb' }
            "
            :class="
              transaction.type === 'income'
                ? 'transaction-badge--income'
                : 'transaction-badge--expense'
            "
          >
            {{ transaction.type === 'income' ? '수입' : '소비' }}
          </span>

          <div class="transaction-copy">
            <strong>{{ transaction.category || '기타' }}</strong>
            <p>{{ transaction.memo || '메모 없음' }}</p>
          </div>
        </div>

        <div class="transaction-item__right">
          <div class="transaction-meta">
            <strong
              :style="{
                color: transaction.type === 'income' ? '#dc2626' : '#2563eb',
              }"
            >
              {{ formatCurrency(transaction.amount, transaction.type) }}
            </strong>
            <span>{{ formatDateTime(transaction) }}</span>
          </div>

          <button
            class="delete-button"
            type="button"
            :disabled="deletingIds.includes(transaction.id)"
            @click="deleteTransaction(transaction)"
          >
            {{ deletingIds.includes(transaction.id) ? '삭제 중..' : '삭제' }}
          </button>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref, watch } from 'vue';

import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  refreshKey: {
    type: Number,
    default: 0,
  },
});

const apiBaseUrl = 'http://localhost:3000';
const authStore = useAuthStore();

const transactions = ref([]);
const isLoaded = ref(false);
const deletingIds = ref([]);
const errorMessage = ref('');
const canPersist = ref(true);
const typeFilter = ref('all');
const categoryFilter = ref('all');
const startDateFilter = ref('');
const endDateFilter = ref('');
const searchQuery = ref('');

const typeOptions = [
  { value: 'all', label: '전체 유형' },
  { value: 'expense', label: '소비' },
  { value: 'income', label: '수입' },
];

const incomeCategories = [
  '월급',
  '부수입',
  '용돈',
  '상여',
  '금융소득',
  '기타(수입)',
];

const expenseCategories = [
  '식비',
  '교통/차량',
  '문화생활',
  '쇼핑',
  '주거/통신',
  '교육',
  '경조사/회비',
  '기타(지출)',
];

const currentUserId = computed(
  () => authStore.currentUser?.id ?? authStore.currentUser?.userId ?? '',
);

const sortedTransactions = computed(() =>
  [...transactions.value].sort((a, b) => toTimestamp(b) - toTimestamp(a)),
);

const categories = computed(() => {
  if (typeFilter.value === 'income') {
    return incomeCategories;
  }

  if (typeFilter.value === 'expense') {
    return expenseCategories;
  }

  return [];
});

const filteredTransactions = computed(() => {
  const keyword = searchQuery.value.toLowerCase();
  const hasActiveFilter =
    typeFilter.value !== 'all' ||
    categoryFilter.value !== 'all' ||
    Boolean(startDateFilter.value) ||
    Boolean(endDateFilter.value) ||
    Boolean(keyword);

  const matchedTransactions = sortedTransactions.value.filter((item) => {
    const typeMatched =
      typeFilter.value === 'all' || item.type === typeFilter.value;
    const categoryMatched =
      categoryFilter.value === 'all' || item.category === categoryFilter.value;
    const startMatched =
      !startDateFilter.value ||
      (item.date && item.date >= startDateFilter.value);
    const endMatched =
      !endDateFilter.value || (item.date && item.date <= endDateFilter.value);

    if (!typeMatched || !categoryMatched || !startMatched || !endMatched) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const target = [
      item.memo,
      item.category,
      item.amount,
      item.date,
      item.time,
      item.type,
    ]
      .join(' ')
      .toLowerCase();

    return target.includes(keyword);
  });

  return hasActiveFilter
    ? matchedTransactions
    : matchedTransactions.slice(0, 5);
});

function formatCurrency(amount, type) {
  const prefix = type === 'income' ? '+' : '-';
  return prefix + Number(amount || 0).toLocaleString('ko-KR') + '원';
}

function formatDateTime(transaction) {
  return `${transaction.date || '-'} ${transaction.time || '00:00'}`;
}

function resetDateFilter() {
  typeFilter.value = 'all';
  categoryFilter.value = 'all';
  startDateFilter.value = '';
  endDateFilter.value = '';
}

function toTimestamp(item) {
  const safeDate = item?.date || '1970-01-01';
  const safeTime = item?.time || '00:00';
  return new Date(`${safeDate}T${safeTime}:00`).getTime();
}

function getBalanceDelta(type, amount) {
  const numericAmount = Number(amount) || 0;
  return type === 'income' ? numericAmount : -numericAmount;
}

async function fetchCurrentBalance() {
  const { data } = await axios.get(
    `${apiBaseUrl}/users/${currentUserId.value}`,
  );
  return Number(data?.balance) || 0;
}

async function updateUserBalance(nextBalance) {
  await axios.patch(`${apiBaseUrl}/users/${currentUserId.value}`, {
    balance: nextBalance,
  });
}

async function refreshAuthenticatedUser(nextBalance) {
  if (!authStore.currentUser) {
    return;
  }

  try {
    await authStore.refreshCurrentUser();
  } catch {
    const fallbackUser = {
      ...authStore.currentUser,
      balance: Number(nextBalance) || 0,
    };
    authStore.currentUser = fallbackUser;
    localStorage.setItem('currentUser', JSON.stringify(fallbackUser));
  }
}

async function fetchTransactions() {
  isLoaded.value = false;
  errorMessage.value = '';

  try {
    const { data } = await axios.get(`${apiBaseUrl}/finances`);
    transactions.value = Array.isArray(data)
      ? data.filter((item) => item.userId === currentUserId.value)
      : [];
    canPersist.value = true;
  } catch (serverError) {
    try {
      const { data } = await axios.get('/db.json');
      const fallbackItems = Array.isArray(data?.finances) ? data.finances : [];
      transactions.value = fallbackItems.filter(
        (item) => item.userId === currentUserId.value,
      );
      canPersist.value = false;
      errorMessage.value = 'json-server 연결이 없어 로컬 데이터만 표시합니다.';
    } catch (fallbackError) {
      console.error(
        '거래 내역을 불러오지 못했습니다.',
        serverError,
        fallbackError,
      );
      transactions.value = [];
      errorMessage.value = '거래 내역을 불러오지 못했습니다.';
    }
  } finally {
    isLoaded.value = true;
  }
}

async function deleteTransaction(transaction) {
  deletingIds.value = [...deletingIds.value, transaction.id];
  errorMessage.value = '';

  try {
    if (canPersist.value) {
      const currentBalance = await fetchCurrentBalance();
      const nextBalance =
        currentBalance - getBalanceDelta(transaction.type, transaction.amount);

      await axios.delete(`${apiBaseUrl}/finances/${transaction.id}`);

      try {
        await updateUserBalance(nextBalance);
        await refreshAuthenticatedUser(nextBalance);
      } catch (balanceError) {
        await axios.post(`${apiBaseUrl}/finances`, transaction).catch(() => {});
        throw balanceError;
      }
    }

    transactions.value = transactions.value.filter(
      (item) => item.id !== transaction.id,
    );

    if (!canPersist.value) {
      errorMessage.value =
        'json-server 연결이 없어 현재 화면에서만 삭제했습니다.';
    }
  } catch (error) {
    console.error('거래 삭제에 실패했습니다.', error);
    errorMessage.value = '거래 삭제에 실패했습니다.';
  } finally {
    deletingIds.value = deletingIds.value.filter((id) => id !== transaction.id);
  }
}

watch(
  () => props.refreshKey,
  () => {
    fetchTransactions();
  },
);

watch(currentUserId, () => {
  fetchTransactions();
});

watch(typeFilter, () => {
  categoryFilter.value = 'all';
});

onMounted(() => {
  fetchTransactions();
});
</script>

<style scoped>
.transaction-panel {
  background: #ffffff;
  border: 1px solid #cfd7df;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(71, 95, 114, 0.14);
  padding: 28px 20px;
}

.section-head {
  margin-bottom: 16px;
}

.section-head h2 {
  font-size: 20px;
  font-weight: 800;
  color: #121212;
}

.section-head p {
  margin-top: 4px;
  color: #111111;
  font-size: 0.95rem;
}

.result-count {
  margin-left: auto;
  margin-top: 0;
  background: #f2e59c;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #111111;
}

.section-head--list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-toolbar {
  display: grid;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-row {
  display: grid;
  grid-template-columns: minmax(0, 0.8fr) minmax(0, 1fr) minmax(0, 2.2fr);
  gap: 8px;
  align-items: stretch;
}

.filter-select {
  width: 100%;
  min-width: 0;
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 400;
}

.date-range-filter {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto minmax(0, 1fr) auto;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.date-range-filter__label {
  font-size: 0.85rem;
  font-weight: 400;
  color: #364152;
}

.date-range-filter__input {
  width: 100%;
  min-width: 0;
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #1f2937;
  font-size: 0.9rem;
  font-weight: 400;
}

.date-range-filter__separator {
  color: #6b7280;
  font-weight: 700;
}

.date-range-filter__reset {
  width: 100%;
  min-width: 0;
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 8px 12px;
  background: #f8fafc;
  color: #334155;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
}

.search-field {
  display: grid;
  gap: 6px;
}

.search-field__label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #161a22;
}

.search-field__input {
  width: 100%;
  min-width: 0;
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.92rem;
  color: #161a22;
}

.status-message {
  padding: 18px;
  border-radius: 16px;
  background: #f4f7fa;
  color: #5e6975;
  text-align: center;
}

.status-message--error {
  background: #fff1f1;
  color: #d53939;
}

.transaction-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
  padding: 0 6px 0 0;
  margin: 0;
  max-height: 480px;
  overflow-y: auto;
}

.transaction-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border: 1px solid #d5dee6;
  border-radius: 16px;
  background: #ffffff;
}

.transaction-item__left,
.transaction-item__right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.transaction-item__right {
  justify-content: flex-end;
}

.transaction-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  white-space: nowrap;
}

.transaction-meta strong {
  font-size: 1.05rem;
  font-weight: 800;
  color: #111111;
}

.transaction-meta span,
.transaction-copy p {
  color: #7b8794;
  font-size: 0.92rem;
}

.transaction-copy strong {
  display: block;
  font-size: 1.02rem;
  font-weight: 800;
  color: #111111;
}

.transaction-badge {
  min-width: 58px;
  text-align: center;
  padding: 7px 12px;
  border-radius: 999px;
  font-size: 0.86rem;
  font-weight: 800;
}

.transaction-badge--income {
  background: #d9e3ff;
  color: #274bdb;
}

.transaction-badge--expense {
  background: #ffd9d9;
  color: #f53f3f;
}

.delete-button {
  min-width: 60px;
  padding: 8px 12px;
  border: 0;
  border-radius: 999px;
  background: #d1d5db;
  color: #111827;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.15s ease,
    background-color 0.15s ease,
    opacity 0.15s ease;
}

.delete-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #bcc3cb;
}

.delete-button:disabled {
  cursor: wait;
  opacity: 0.7;
}

@media (max-width: 900px) {
  .filter-row {
    grid-template-columns: 1fr;
  }

  .date-range-filter {
    grid-template-columns: 1fr;
  }

  .date-range-filter__separator {
    display: none;
  }
}

@media (max-width: 720px) {
  .transaction-panel {
    padding: 20px 16px;
  }

  .transaction-item,
  .transaction-item__left,
  .transaction-item__right {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .transaction-meta {
    align-items: flex-start;
  }
}
</style>
