<!-- 페이지 상단 헤더 -->
<template>
  <div class="flex items-center p-4 bg-blue-100">
    <div class="flex flex-1 space-x-4 items-end">
      <div class="text-4xl font-bold">{{ currentUserBudget }} 원으로 한달살기</div>
    </div>
    <div class="flex gap-5 items-center">
      <div class="text-sm bg-mist-50 px-3 py-1 rounded-full shadow-sm">
        <span class="text-cyan-600">{{ userName }}</span> 님
      </div>
      <button
        type="button"
        @click="handleLogout"
        class="inline-flex h-8 items-center justify-center rounded-full px-3 text-sm leading-none text-cyan-500 hover:cursor-pointer hover:text-cyan-700"
      >
        로그아웃
      </button>
      <button
        @click="goSettings"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full leading-none hover:cursor-pointer"
      >
        <font-awesome-icon :icon="faSliders" class="text-cyan-500 text-xl hover:text-cyan-700" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const dbData = ref(null);
const currentMonth = new Date().toISOString().slice(0, 7);

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

// 사용자 소비 제한 금액 불러오기 - 타이틀
onMounted(async () => {
  try {
    const response = await fetch("/db.json");
    dbData.value = await response.json();
  } catch (error) {
    console.error("헤더 예산 데이터를 불러오지 못했습니다:", error);
  }
});

const currentUserId = computed(() => authStore.currentUser?.id ?? "");

const userName = computed(() => authStore.currentUser?.name ?? "사용자 이름");

const currentUserBudget = computed(() => {
  if (!dbData.value?.budgets || !currentUserId.value) {
    return "0";
  }

  const budget = dbData.value.budgets.find(
    (item) => item.userId === currentUserId.value && item.month === currentMonth,
  );

  if (!budget?.limit) {
    return "0";
  }

  return new Intl.NumberFormat("ko-KR").format(budget.limit);
});

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

// 라우터 이동
function goSettings() {
  router.push("/settings");
}
</script>
