<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  items: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete-transaction'])
</script>

<template>
  <div v-if="items.length" class="transaction-list">
    <article v-for="item in items" :key="item.id" class="transaction-card">
      <div>
        <div class="transaction-head">
          <span class="badge" :class="item.type">{{ item.type === 'income' ? '수입' : '소비' }}</span>
          <strong>{{ item.category }}</strong>
        </div>
        <p>{{ item.memo || '메모 없음' }}</p>
      </div>
      <div class="transaction-meta">
        <strong :class="item.type === 'expense' ? 'transaction-expense-amount' : 'income-text'">
          {{ formatCurrency(item.amount) }}
        </strong>
        <span>{{ item.date }}</span>
        <button class="transaction-delete-button" type="button" @click="emit('delete-transaction', item.id)">
          삭제
        </button>
      </div>
    </article>
  </div>
  <p v-else class="feedback hint">조건에 맞는 거래가 없습니다.</p>
</template>
