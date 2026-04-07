<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  summary: { type: Object, required: true },
})
</script>

<template>
  <div class="summary-grid">
    <article class="summary-card income">
      <span>수입</span>
      <strong>{{ formatCurrency(summary.income) }}</strong>
    </article>
    <article class="summary-card expense">
      <span>지출</span>
      <strong>{{ formatCurrency(summary.expense) }}</strong>
    </article>
    <article class="summary-card balance">
      <span>순이익</span>
      <strong>{{ formatCurrency(summary.balance) }}</strong>
    </article>
  </div>
</template>
