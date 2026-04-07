<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { label: '개요', description: '차트와 전체 흐름 보기', routeName: 'dashboard' },
  { label: '거래 관리', description: '기록 입력과 조회', routeName: 'transactions' },
  { label: '소비 달력', description: '날짜별 수입/지출 확인', routeName: 'calendar' },
  { label: '예산 관리', description: '월간 한도와 지출 점검', routeName: 'budget' },
]

function moveTo(routeName) {
  router.push({ name: routeName })
}
</script>

<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="section-label">주메뉴</p>
        <h2>기능 바로가기</h2>
      </div>
    </div>

    <div class="menu-grid">
      <button
        v-for="item in menuItems"
        :key="item.routeName"
        class="menu-button"
        :class="{ active: route.name === item.routeName }"
        type="button"
        @click="moveTo(item.routeName)"
      >
        <strong>{{ item.label }}</strong>
        <span>{{ item.description }}</span>
      </button>
    </div>
  </section>
</template>
