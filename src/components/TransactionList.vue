<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  items: { type: Array, default: () => [] },
})
</script>

<template>
  <div v-if="items.length" class="transaction-list">
    <article v-for="item in items" :key="item.id" class="transaction-card">
      <div>
        <div class="transaction-head">
          <span class="badge" :class="item.type">{{ item.type === 'income' ? '수입' : '지출' }}</span>
          <strong>{{ item.category }}</strong>
        </div>
        <p>{{ item.memo || '메모 없음' }}</p>
      </div>
      <div class="transaction-meta">
        <strong>{{ formatCurrency(item.amount) }}</strong>
        <span>{{ item.date }}</span>
      </div>
    </article>
  </div>
  <p v-else class="feedback hint">조건에 맞는 거래가 없습니다.</p>
</template>
