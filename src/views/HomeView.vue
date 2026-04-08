<template>
  <div class="min-h-screen bg-gray-50 p-6 md:p-10">
    <header
      class="mb-8 p-4 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed text-center"
    >
      <Header />
    </header>
    <button type="button" @click="handleLogout" class="border-1">로그아웃</button>

    <main class="grid grid-cols-12 gap-8">
      <div
        class="col-start-3 col-span-6 space-y-8 p-4 bg-green-50 rounded-xl border border-green-200"
      >
        <h2 class="mb-2 text-xs font-bold text-green-400 uppercase">
          Main Content Area (6 Columns)
        </h2>

        <div class="bg-white rounded-lg shadow-sm"><CurrentBudget /></div>
        <div class="bg-white rounded-lg shadow-sm"><Summary /></div>
        <div class="bg-white rounded-lg shadow-sm"><Graph /></div>
      </div>

      <div class="col-span-2 space-y-8 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
        <h2 class="mb-2 text-xs font-bold text-yellow-400 uppercase">Side Area (2 Columns)</h2>

        <div class="bg-white rounded-lg shadow-sm"><UserBalance /></div>
        <div class="bg-white rounded-lg shadow-sm"><Menu /></div>
      </div>
    </main>

    <footer
      class="mt-16 p-6 bg-pink-50 rounded-lg border border-pink-100 text-center text-sm text-gray-500 space-y-1"
    >
      <p>이벤트 진행 현황: 1. 예산 진행률(차오르는 bar) 2. 수입 지출 각자 합 3.</p>
      <p>진행현황 퍼센트별 색상 변경</p>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import Header from "@/components/Header.vue";
import UserBalance from "@/components/UserBalance.vue";
import Menu from "@/components/Menu.vue";
import CurrentBudget from "@/components/CurrentBudget.vue";
import Summary from "@/components/Summary.vue";
import Graph from "@/components/Graph.vue";

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push("/login");
}
</script>
