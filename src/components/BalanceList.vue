<template>
  <section class="transaction-panel">
    <div class="section-head section-head--list">
      <h2>최근 거래 내역</h2>
      <p>{{ recentTransactions.length }}건</p>
    </div>

    <div v-if="errorMessage" class="status-message status-message--error">
      {{ errorMessage }}
    </div>
    <div v-else-if="!isLoaded" class="status-message">
      거래 내역을 불러오는 중입니다.
    </div>
    <div v-else-if="recentTransactions.length === 0" class="status-message">
      등록된 거래가 없습니다.
    </div>

    <ul v-else class="transaction-list">
      <li
        v-for="transaction in recentTransactions"
        :key="transaction.id"
        class="transaction-item"
      >
        <div class="transaction-item__left">
          <span
            class="transaction-badge"
            :class="
              transaction.type === 'income'
                ? 'transaction-badge--income'
                : 'transaction-badge--expense'
            "
          >
            {{ transaction.type === 'income' ? '수입' : '지출' }}
          </span>

          <div class="transaction-copy">
            <strong>{{ transaction.category || '기타' }}</strong>
            <p>{{ transaction.memo || '메모 없음' }}</p>
          </div>
        </div>

        <div class="transaction-item__right">
          <div class="transaction-meta">
            <strong>{{ formatCurrency(transaction.amount) }}</strong>
            <span>{{ transaction.date }}</span>
          </div>

          <button
            class="delete-button"
            type="button"
            :disabled="deletingIds.includes(transaction.id)"
            @click="deleteTransaction(transaction)"
          >
            {{ deletingIds.includes(transaction.id) ? '삭제 중...' : '삭제' }}
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

const currentUserId = computed(
  () =>
    authStore.currentUser?.id ?? authStore.currentUser?.userId ?? 'user-001',
);

const recentTransactions = computed(() =>
  [...transactions.value]
    .sort((a, b) => {
      const left = `${b.date ?? ''} ${b.time ?? '00:00'}`;
      const right = `${a.date ?? ''} ${a.time ?? '00:00'}`;
      return left.localeCompare(right);
    })
    .slice(0, 5),
);

function formatCurrency(amount) {
  return `${Number(amount || 0).toLocaleString('ko-KR')}원`;
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
      errorMessage.value =
        'json-server에 연결할 수 없어 로컬 데이터만 표시합니다.';
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
      await axios.delete(`${apiBaseUrl}/finances/${transaction.id}`);
    }

    transactions.value = transactions.value.filter(
      (item) => item.id !== transaction.id,
    );

    if (!canPersist.value) {
      errorMessage.value =
        'json-server 연결이 없어 현재 화면에서만 삭제되었습니다.';
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
  font-size: 1.75rem;
  font-weight: 800;
  color: #121212;
}

.section-head p {
  margin-top: 4px;
  color: #6f7d89;
  font-size: 0.95rem;
}

.section-head--list {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
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
  padding: 0;
  margin: 0;
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
