<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';
import UserBalance from '@/components/UserBalance.vue';

const route = useRoute();
const isAuthLayout = computed(() => route.meta.layout === 'auth');
</script>

<template>
  <RouterView v-if="isAuthLayout" />

  <div v-else class="min-h-screen bg-gray-50 p-6 md:p-10">
    <header
      class="mb-10 p-4 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed text-center"
    >
      <Header />
    </header>
    <div class="p-4"></div>

    <main class="mx-auto grid max-w-8xl grid-cols-12 gap-8">
      <div class="col-span-8 space-y-6 lg:col-start-3 lg:col-span-6">
        <RouterView></RouterView>
      </div>

      <div class="col-span-4 space-y-6 lg:col-span-2">
        <div><UserBalance /></div>
        <div><Menu /></div>
      </div>
    </main>

    <div class="p-4"></div>

    <footer
      class="mt-16 p-6 bg-pink-50 rounded-lg border border-pink-100 text-center text-sm text-gray-500 space-y-1"
    >
      <p>
        이벤트 진행 현황: 1. 예산 진행률(차오르는 bar) 2. 수입 지출 각자 합 3.
      </p>
      <p>진행현황 퍼센트별 색상 변경</p>
    </footer>
  </div>
</template>

<style scoped></style>
