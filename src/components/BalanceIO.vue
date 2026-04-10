<template>
  <section class="transaction-panel">
    <div class="section-head">
      <h1>거래 등록</h1>
      <p>수입과 소비 내역을 입력합니다.</p>
    </div>

    <form class="transaction-form" @submit.prevent="submitTransaction">
      <div class="transaction-form__row transaction-form__row--compact">
        <label class="field-chip">
          <span>유형</span>
          <select v-model="form.type">
            <option value="expense">소비</option>
            <option value="income">수입</option>
          </select>
        </label>

        <label class="field-chip">
          <span>카테고리</span>
          <select v-model="form.category">
            <option
              v-for="category in categoryOptions"
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </label>

        <label class="field-chip">
          <span>날짜</span>
          <input v-model="form.date" type="date" />
        </label>

        <label class="field-chip field-chip--amount">
          <span>금액</span>
          <input
            v-model.number="form.amount"
            type="number"
            min="0"
            step="1"
            placeholder="금액 입력"
          />
        </label>
      </div>

      <div class="transaction-form__row">
        <label class="memo-field">
          <span>메모</span>
          <textarea
            v-model.trim="form.memo"
            rows="2"
            placeholder="거래 내용을 간단히 입력하세요"
          />
        </label>

        <button class="submit-button" type="submit" :disabled="isSubmitting">
          {{ isSubmitting ? '등록 중...' : '등록' }}
        </button>
      </div>

      <p v-if="errorMessage" class="status-message status-message--error">
        {{ errorMessage }}
      </p>
      <p v-else-if="infoMessage" class="status-message">
        {{ infoMessage }}
      </p>
    </form>
  </section>
</template>

<script setup>
import axios from 'axios';
import { computed, reactive, ref, watch } from 'vue';

import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['created']);

const apiBaseUrl = 'http://localhost:3000';
const authStore = useAuthStore();
const today = new Date().toISOString().slice(0, 10);

const isSubmitting = ref(false);
const errorMessage = ref('');
const infoMessage = ref('');

const categoryMap = {
  income: ['월급', '부수입', '용돈', '상여', '금융소득', '기타(수입)'],
  expense: [
    '식비',
    '교통/차량',
    '문화생활',
    '쇼핑',
    '주거/통신',
    '교육',
    '경조사/회비',
    '기타(소비)',
  ],
};

const form = reactive({
  type: 'expense',
  category: categoryMap.expense[0],
  date: today,
  amount: null,
  memo: '',
});

const currentUserId = computed(
  () =>
    authStore.currentUser?.id ?? authStore.currentUser?.userId ?? 'user-001',
);

const categoryOptions = computed(() => categoryMap[form.type]);

watch(
  () => form.type,
  (nextType) => {
    form.category = categoryMap[nextType][0];
  },
);

function buildTimeLabel(date = new Date()) {
  return `${String(date.getHours()).padStart(2, '0')}:${String(
    date.getMinutes(),
  ).padStart(2, '0')}`;
}

function resetForm() {
  form.type = 'expense';
  form.category = categoryMap.expense[0];
  form.date = today;
  form.amount = null;
  form.memo = '';
}

async function submitTransaction() {
  if (!form.amount || form.amount <= 0) {
    errorMessage.value = '금액은 0보다 크게 입력해주세요.';
    infoMessage.value = '';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  infoMessage.value = '';

  const createdAt = new Date();
  const payload = {
    id: `fin-${Date.now()}`,
    userId: currentUserId.value,
    type: form.type,
    amount: Number(form.amount),
    category: form.category,
    date: form.date,
    time: buildTimeLabel(createdAt),
    memo: form.memo,
  };

  try {
    await axios.post(`${apiBaseUrl}/finances`, payload);
    resetForm();
    emit('created');
  } catch (serverError) {
    console.error('거래 등록에 실패했습니다.', serverError);
    errorMessage.value =
      'json-server 연결이 필요합니다. 서버 실행 상태를 확인해주세요.';
  } finally {
    isSubmitting.value = false;
  }
}
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

.section-head h1 {
  font-size: 20px;
  font-weight: 800;
  color: #121212;
}

.section-head p {
  margin-top: 4px;
  color: #6f7d89;
  font-size: 0.95rem;
}

.transaction-form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.transaction-form__row {
  display: flex;
  gap: 12px;
  align-items: stretch;
}

.transaction-form__row--compact {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

.field-chip {
  min-width: 0;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid #cad3db;
  border-radius: 999px;
  padding: 0 14px;
  background: #ffffff;
}

.field-chip span,
.memo-field span {
  flex: 0 0 auto;
  font-size: 0.95rem;
  font-weight: 700;
  color: #303740;
}

.field-chip select,
.field-chip input {
  flex: 1 1 auto;
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  min-height: 48px;
  color: #111827;
}

.field-chip--amount {
  flex: 1 0 100%;
}

.memo-field {
  flex: 1;
  display: grid;
  grid-template-columns: 72px minmax(0, 1fr);
  border: 1px solid #cad3db;
  border-radius: 22px;
  overflow: hidden;
  min-height: 86px;
}

.memo-field span {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 14px;
  background: #ffffff;
  border-right: 1px solid #cad3db;
}

.memo-field textarea {
  width: 100%;
  border: 0;
  resize: none;
  outline: 0;
  padding: 14px 16px;
  color: #111827;
}

.submit-button {
  align-self: flex-end;
  min-width: 96px;
  padding: 0 20px;
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

.submit-button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #bcc3cb;
}

.submit-button:disabled {
  cursor: wait;
  opacity: 0.7;
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

@media (max-width: 720px) {
  .transaction-panel {
    padding: 20px 16px;
  }

  .transaction-form__row {
    flex-direction: column;
  }

  .transaction-form__row--compact {
    grid-template-columns: 1fr;
  }

  .field-chip {
    border-radius: 18px;
  }

  .memo-field {
    grid-template-columns: 1fr;
  }

  .memo-field span {
    justify-content: flex-start;
    padding: 12px 14px 0;
    border-right: 0;
  }
}
</style>