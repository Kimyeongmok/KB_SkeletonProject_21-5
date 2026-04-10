<style>
.title {
  font-size: 20px;
  font-weight: 800;
}

</style>

<template>
  <div
    class="flex flex-col w-full bg-white p-6 gap-4 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
<<<<<<< HEAD
    <h3 class="title">목표 설정</h3>
=======
    <h3 class="mb-2 text-xl text-[#343434] small-title">목표 설정</h3>
>>>>>>> a39a3eb3f9ad600f424261f87ed690228d58adcd

    <div class="grid grid-cols-2 gap-4 mb-4">
      <div class="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p class="text-xs text-gray-500 mb-1">지난 달 소비 예산</p>
<<<<<<< HEAD
        <p class="font-[700] text-gray-700">
          {{ lastMonthLimit.toLocaleString() }}원
        </p>
=======
        <p class="font-bold text-gray-700">{{ lastMonthLimit.toLocaleString() }}원</p>
>>>>>>> a39a3eb3f9ad600f424261f87ed690228d58adcd
      </div>
      <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
        <p class="text-xs text-blue-500 mb-1">이번 달 목표 예산</p>
        <p class="font-bold text-blue-700">
          {{ currentMonthLimit > 0 ? currentMonthLimit.toLocaleString() + "원" : "미설정" }}
        </p>
      </div>
    </div>

    <div class="flex flex-col gap-1">
      <p class="w-full text-md font-medium text-gray-600">이번 달 예산 설정</p>
      <div class="flex flex-col sm:flex-row gap-2">
        <input
          v-model.number="thisMonthLimit"
          type="number"
          placeholder="금액 입력"
          @keyup.enter="registerBudget"
          class="w-full sm:w-auto bg-gray-50 p-3 rounded-xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-700"
        />
        <button
          @click="registerBudget"
          class="w-full sm:w-auto px-5 py-3 bg-gray-400 text-white font-bold rounded-xl hover:bg-gray-500 active:scale-95 transition-all text-sm"
        >
          등록
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const lastMonthLimit = ref(0);
const currentMonthLimit = ref(0);
const thisMonthLimit = ref(null);
const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.currentUser?.id ?? authStore.currentUser?.userId ?? "",
);

const getMonthString = (offset = 0) => {
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth() + offset, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const fetchBudgets = async () => {
  try {
    if (!currentUserId.value) {
      lastMonthLimit.value = 0;
      currentMonthLimit.value = 0;
      return;
    }

    const lastMonthStr = getMonthString(-1);
    const thisMonthStr = getMonthString(0);

    const response = await axios.get("http://localhost:3000/budgets");

    const lastData = response.data.find(
      (item) => item.userId === currentUserId.value && item.month === lastMonthStr,
    );
    if (lastData) lastMonthLimit.value = lastData.limit;
    else lastMonthLimit.value = 0;

    const thisData = response.data.find(
      (item) => item.userId === currentUserId.value && item.month === thisMonthStr,
    );
    if (thisData) currentMonthLimit.value = thisData.limit;
    else currentMonthLimit.value = 0;
  } catch (error) {
    console.error("예산 로드 실패:", error);
  }
};

const registerBudget = async () => {
  if (!currentUserId.value) {
    alert("로그인 후 이용해주세요.");
    return;
  }

  if (!thisMonthLimit.value || thisMonthLimit.value <= 0) {
    alert("올바른 금액을 입력해주세요.");
    return;
  }

  try {
    const thisMonthStr = getMonthString(0);
    const checkResponse = await axios.get(
      `http://localhost:3000/budgets?userId=${currentUserId.value}&month=${thisMonthStr}`,
    );
    const existingBudget = checkResponse.data[0];

    if (existingBudget) {
      await axios.patch(`http://localhost:3000/budgets/${existingBudget.id}`, {
        limit: thisMonthLimit.value,
      });
    } else {
      await axios.post("http://localhost:3000/budgets", {
        userId: currentUserId.value,
        month: thisMonthStr,
        limit: thisMonthLimit.value,
      });
    }

    currentMonthLimit.value = thisMonthLimit.value;
    thisMonthLimit.value = null;
  } catch (error) {
    console.error("처리 실패:", error);
    alert("오류가 발생했습니다.");
  }
};

onMounted(() => {
  fetchBudgets();
});
</script>
