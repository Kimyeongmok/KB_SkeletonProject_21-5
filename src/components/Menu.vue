<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const menuItems = [
  { label: '메인메뉴', routeName: 'dashboard', iconClass: 'fa-solid fa-house' },
  { label: '거래관리', routeName: 'transaction-manage', iconClass: 'fa-solid fa-pen-to-square' },
  { label: '거래내역', routeName: 'transactions', iconClass: 'fa-solid fa-wallet' },
  { label: '거래내역 달력', routeName: 'calendar', iconClass: 'fa-solid fa-calendar-days' },
  { label: '예산관리', routeName: 'budget', iconClass: 'fa-solid fa-chart-pie' },
]

function moveTo(routeName) {
  router.push({ name: routeName })
}
</script>

<template>
  <section>
    <div class="section-heading compact">
      <div>
        <p class="section-label">메뉴</p>
        <h2>바로가기</h2>
      </div>
    </div>

    <div class="sidebar-menu">
      <button
        v-for="item in menuItems"
        :key="item.routeName"
        class="sidebar-menu-item"
        :class="{ active: route.name === item.routeName }"
        type="button"
        @click="moveTo(item.routeName)"
      >
        <i class="menu-icon" :class="item.iconClass" aria-hidden="true"></i>
        <strong>{{ item.label }}</strong>
      </button>
    </div>
  </section>
</template>
