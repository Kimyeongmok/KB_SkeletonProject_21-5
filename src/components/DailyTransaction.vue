<template>
  <section class="daily-card">
    <div class="toolbar">
      <div class="filter-row">
        <div class="type-filter">
          <label class="sr-only" for="typeSelect">유형 선택</label>
          <select id="typeSelect" v-model="typeFilter" class="category-select">
            <option
              v-for="item in typeOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.label }}
            </option>
          </select>
        </div>

        <div class="category-filter">
          <label class="sr-only" for="categorySelect">카테고리 선택</label>
          <select
            id="categorySelect"
            v-model="categoryFilter"
            class="category-select"
          >
            <option value="all">카테고리 전체</option>
            <option
              v-for="category in categories"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>

        <span class="result-count">{{ filteredTransactions.length }}건</span>
      </div>

      <div class="search-wrap">
        <label class="search-label" for="transactionSearch">검색어</label>
        <input
          id="transactionSearch"
          v-model.trim="searchQuery"
          type="text"
          class="search-input"
          placeholder="메모 또는 카테고리 검색"
        />
      </div>
    </div>

    <div ref="scrollContainer" class="transaction-scroll">
      <template v-if="groupedTransactions.length">
        <section
          v-for="group in groupedTransactions"
          :key="group.date"
          :data-date="group.date"
          class="date-group"
          :class="{ selected: group.date === selectedDate }"
        >
          <header class="date-header">
            <strong>{{ formatDateLabel(group.date) }}</strong>
            <span>{{ group.items.length }}건</span>
          </header>

          <article
            v-for="item in group.items"
            :key="item.id"
            class="transaction-item"
          >
            <div class="transaction-item__left">
              <span
                class="transaction-badge"
                :style="
                  item.type === 'income'
                    ? { background: '#fee2e2', color: '#dc2626' }
                    : { background: '#dbeafe', color: '#2563eb' }
                "
                :class="
                  item.type === 'income'
                    ? 'transaction-badge--income'
                    : 'transaction-badge--expense'
                "
              >
                {{ item.type === 'income' ? '수입' : '소비' }}
              </span>

              <div class="transaction-copy">
                <strong>{{ item.category || '기타' }}</strong>
                <p>{{ item.memo || '메모 없음' }}</p>
              </div>
            </div>

            <div class="transaction-item__right">
              <div class="transaction-meta">
                <strong
                  :style="{
                    color: item.type === 'income' ? '#dc2626' : '#2563eb',
                  }"
                >
                  {{ item.type === 'expense' ? '-' : '+'
                  }}{{ formatNumber(item.amount) }}원
                </strong>
                <span>{{ item.date }} {{ item.time || '00:00' }}</span>
              </div>
            </div>
          </article>
        </section>
      </template>

      <p v-else class="empty-state">조건에 맞는 거래 내역이 없습니다.</p>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue';

const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  selectedDate: {
    type: String,
    required: true,
  },
  selectedMonth: {
    type: Date,
    required: true,
  },
});

const typeFilter = ref('all');
const categoryFilter = ref('all');
const searchQuery = ref('');
const scrollContainer = ref(null);
const pendingScroll = ref(false);

const typeOptions = [
  { value: 'all', label: '유형 전체' },
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
  '기타(소비)',
];

const selectedMonthKey = computed(() => {
  const year = props.selectedMonth.getFullYear();
  const month = String(props.selectedMonth.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
});

const monthTransactions = computed(() =>
  props.transactions
    .filter((item) => item?.date?.startsWith(selectedMonthKey.value))
    .sort((a, b) => toTimestamp(b) - toTimestamp(a)),
);

const categories = computed(() => {
  if (typeFilter.value === 'all') {
    return [];
  }

  return typeFilter.value === 'income' ? incomeCategories : expenseCategories;
});

const filteredTransactions = computed(() => {
  const keyword = searchQuery.value.toLowerCase();

  return monthTransactions.value.filter((item) => {
    const typeMatched =
      typeFilter.value === 'all' || item.type === typeFilter.value;
    const categoryMatched =
      categoryFilter.value === 'all' || item.category === categoryFilter.value;

    if (!typeMatched || !categoryMatched) return false;
    if (!keyword) return true;

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
});

const groupedTransactions = computed(() => {
  const grouped = new Map();

  for (const item of filteredTransactions.value) {
    if (!grouped.has(item.date)) {
      grouped.set(item.date, []);
    }

    grouped.get(item.date).push(item);
  }

  return [...grouped.entries()].map(([date, items]) => ({
    date,
    items: [...items].sort((a, b) => toTimestamp(b) - toTimestamp(a)),
  }));
});

watch(
  () => props.selectedDate,
  async () => {
    typeFilter.value = 'all';
    categoryFilter.value = 'all';
    searchQuery.value = '';
    pendingScroll.value = true;
    await nextTick();
    scrollToSelectedDate();
  },
  { immediate: true, flush: 'post' },
);

watch(typeFilter, () => {
  categoryFilter.value = 'all';
});

watch(groupedTransactions, async () => {
  if (!pendingScroll.value) return;
  await nextTick();
  scrollToSelectedDate();
});

function scrollToSelectedDate() {
  const container = scrollContainer.value;
  const section = container?.querySelector(
    `[data-date="${props.selectedDate}"]`,
  );

  if (!container || !section) {
    pendingScroll.value = false;
    return;
  }

  const containerRect = container.getBoundingClientRect();
  const sectionRect = section.getBoundingClientRect();
  const nextTop = sectionRect.top - containerRect.top + container.scrollTop;

  container.scrollTo({
    top: Math.max(nextTop, 0),
    behavior: 'smooth',
  });

  pendingScroll.value = false;
}

function toTimestamp(item) {
  const safeDate = item?.date || '1970-01-01';
  const safeTime = item?.time || '00:00';
  return new Date(`${safeDate}T${safeTime}:00`).getTime();
}

function formatDateLabel(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  const weekday = ['일', '월', '화', '수', '목', '금', '토'][date.getDay()];
  return `${dateString} (${weekday})`;
}

function formatNumber(value) {
  return Number(value || 0).toLocaleString('ko-KR');
}
</script>

<style scoped>
.daily-card {
  border: 1px solid #cfd7df;
  border-radius: 24px;
  background: #ffffff;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(71, 95, 114, 0.14);
}

.toolbar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 14px;
}

.filter-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.type-filter {
  display: inline-flex;
}

.category-select {
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 8px 12px;
  background: #ffffff;
  color: #1f2937;
  font-size: 0.85rem;
  font-weight: 700;
}

.result-count {
  margin-left: auto;
  background: #f2e59c;
  border-radius: 999px;
  padding: 8px 14px;
  font-size: 0.82rem;
  font-weight: 800;
  color: #3f3a1a;
}

.search-wrap {
  display: grid;
  gap: 6px;
}

.search-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #161a22;
}

.search-input {
  border: 1px solid #cfd5de;
  border-radius: 999px;
  padding: 10px 14px;
  font-size: 0.92rem;
  color: #161a22;
}

.transaction-scroll {
  max-height: 460px;
  overflow-y: auto;
  padding-right: 4px;
}

.date-group {
  padding: 10px 2px;
  border-top: 1px solid #eef2f7;
}

.date-group:first-of-type {
  border-top: 0;
}

.date-group.selected {
  background: #f8fbff;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: #364152;
  margin-bottom: 8px;
  font-size: 0.88rem;
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

.empty-state {
  margin: 0;
  text-align: center;
  color: #6b7280;
  padding: 32px 0;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 760px) {
  .result-count {
    margin-left: 0;
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
