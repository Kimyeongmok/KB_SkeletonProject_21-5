<script setup>
import { formatCurrency } from '@/utils/format'

defineProps({
  userName: { type: String, default: '' },
  userId: { type: String, default: '' },
  balance: { type: Number, default: 0 },
})

defineEmits(['logout'])
</script>

<template>
  <header class="hero-header">
    <div>
      <p class="eyebrow">Personal Finance Workspace</p>
      <h1>{{ userName }}님의 가계부</h1>
      <p class="hero-copy">아이디 {{ userId }} 기준으로 거래 내역과 월별 예산을 추적합니다.</p>
    </div>

    <div class="hero-actions">
      <div class="balance-card">
        <span>현재 보유 금액</span>
        <strong>{{ formatCurrency(balance) }}</strong>
      </div>
      <button class="secondary-button" type="button" @click="$emit('logout')">로그아웃</button>
    </div>
  </header>
</template>
