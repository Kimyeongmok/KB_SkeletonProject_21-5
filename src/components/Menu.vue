<!-- 우측 사이드 메뉴 바 -->

<template>
  <nav
    class="flex flex-col gap-3 p-6 bg-white rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)] w-full"
  >
    <h2
      class="text-center font-bold text-[#343434] mb-4 text- border-b pb-2 small-title"
    >
      메뉴
    </h2>

    <router-link
      v-for="item in menuItems"
      :key="item.to"
      :to="item.to"
      class="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-gray-500 transition-all border-2 border-transparent hover:bg-gray-50"
      exact-active-class="bg-blue-50 text-blue-600 border-blue-200 shadow-sm"
    >
      <span class="text-2xl">{{ item.icon }}</span>
      <span class="text-base">{{ item.label }}</span>
    </router-link>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const menuItems = ref([
  { icon: '🏠', label: '메인', to: '/home' },
  { icon: '📅', label: '달력', to: '/calendar' },
  { icon: '🤝', label: '관리', to: '/transactions' },
  { icon: '💰', label: '목표', to: '/budget' },
]);
</script>
