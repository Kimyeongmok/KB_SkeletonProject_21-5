<!-- 우측 사이드 메뉴 바 -->
<template>
    <nav class="flex flex-col gap-3">
        <h2 class="text-center font-bold text-[#343434] mb-2">메뉴</h2> 
        <router-link
            to="/HomeView"
            class="menu-main flex items-center rounded-2xl border-2 border-gray font-bold
            transition-all hover:bg-blue-50"
            ><span>메인화면</span>
        </router-link>        
        <router-link
            to="/TranscationView"
            class="menu-transaction flex items-center rounded-2xl border-2 font-bold transition-all hover:bg-blue-50"
            ><span>거래내역</span>
        </router-link>        
        <router-link
            to="/CalendarView"
            class="menu-calendar flex items-center rounded-2xl border-2 font-bold transition-all hover:bg-blue-50"
            ><span>소비달력</span>
        </router-link>        
        <router-link
            to="/BudgetView"
            class="menu-budget flex items-center rounded-2xl border-2 font-bold transition-all hover:bg-blue-50"
            >
            <span class="text-xl">💰</span>
            <span>예산관리</span>
        </router-link>
        </nav>
</template>

<!--
<template>
  <aside class="w-80 bg-white p-6 rounded-3xl border border-gray-100 shadow-md">
    <h2 class="text-center font-bold text-[#343434] mb-6 text-xl">
      메뉴
    </h2>

    <nav class="flex flex-col gap-4">
      <router-link
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.to"
        class="flex items-center gap-3 p-4 rounded-2xl transition-all border group"
        :class="[
          'bg-white border-gray-100 hover:bg-blue-50',
          { 'bg-blue-50 border-blue-200': item.active } // 정적 이미지 재현을 위한 강제 활성
        ]"
        active-class="bg-blue-50 border-blue-200"
      >
        <span class="text-2xl mr-1">{{ item.icon }}</span>
        <span class="font-bold text-gray-700">{{ item.label }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';

// 메뉴 항목 목록
// icon: 3D 이모지 (텍스트로 삽입), label: 텍스트, to: 이동할 경로, active: 정적 이미지 재현을 위한 강제 활성 여부
const menuItems = ref([
  { icon: '🏠', label: '메인화면', to: '/', active: true },
  { icon: '🤝', label: '거래관리', to: '/transactions', active: false },
  { icon: '📅', label: '소비달력', to: '/calendar', active: false },
  { icon: '💰', label: '예산관리', to: '/budget', active: false },
]);
</script>

<style scoped>
/* 필요한 커스텀 스타일이 있다면 여기에 추가 (Tailwind를 주로 사용하므로 거의 불필요) */
</style>
-->
