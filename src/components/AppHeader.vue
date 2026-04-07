<script setup>
defineProps({
  userName: { type: String, default: '' },
  userId: { type: String, default: '' },
  balance: { type: Number, default: 0 },
})

defineEmits(['logout'])
</script>

<template>
  <header class="topbar">
    <div class="brand-block">
      <div class="brand-mark">잎</div>
      <div>
        <p class="brand-subtitle">Smart Ledger</p>
        <h1>가계부의 정석</h1>
      </div>
    </div>

    <div class="topbar-actions">
      <span class="user-chip">{{ userName }} · {{ userId }}</span>
      <button class="secondary-button" type="button" @click="$emit('logout')">로그아웃</button>
    </div>
  </header>
</template>
