<template>
  <div class="transaction-page">
    <main class="transaction-layout">
      <Summary />
      <BalanceIO @created="handleCreated" />
      <BalanceList :refresh-key="refreshKey" />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Summary from '@/components/Summary.vue';
import BalanceIO from '@/components/BalanceIO.vue';
import BalanceList from '@/components/BalanceList.vue';
import { useAuthStore } from '@/stores/auth';

const refreshKey = ref(0);
const authStore = useAuthStore();

async function handleCreated() {
  refreshKey.value += 1;

  try {
    await authStore.refreshCurrentUser();
  } catch (error) {
    console.error('사용자 정보 새로고침에 실패했습니다.', error);
  }
}
</script>

<style scoped>
.transaction-page {
  min-height: 100vh;
}

.transaction-layout {
  max-width: 920px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

@media (max-width: 720px) {
  .transaction-page {
    padding: 20px 16px;
  }
}
</style>
