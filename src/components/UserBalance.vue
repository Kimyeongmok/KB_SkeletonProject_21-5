<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  currentMoney: { type: Number, default: 0 },
  previousMonthMoney: { type: Number, default: 0 },
  moneyDeltaLabel: { type: String, default: '' },
  moneyDeltaClass: { type: String, default: '' },
})
</script>

<template>
  <section class="panel money-panel">
    <p class="section-label">현재 보유 금액</p>
    <strong>{{ formatCurrency(currentMoney) }}</strong>
    <small :class="moneyDeltaClass">{{ moneyDeltaLabel }}</small>
    <small>지난달 추정 잔액 {{ formatCurrency(previousMonthMoney) }}</small>
  </section>
</template>
