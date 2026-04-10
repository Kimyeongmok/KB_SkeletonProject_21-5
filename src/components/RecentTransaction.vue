<!-- 1년 평균 소비 금액 & 지난 3개월 소비 금액 -->
<template>
  <div
    class="flex flex-col w-full bg-white p-6 gap-4 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
    <h3 class="font-bold mb-4 text-xl text-[#343434] small-title">소비 금액</h3>

    <div class="text-sm text-gray-700 mb-6">
      <p>1년 평균 소비 금액</p>
      <div class="flex justify-left w-full p-4 gap-4">
        <div class="bg-blue-50 text-lg p-7 rounded-3xl border border-gray-100">
          ₩ {{ yearAverage.toLocaleString() }}
        </div>
      </div>
    </div>

    <div class="w-full text-sm text-gray-700 mb-6">
      <p>지난 3달 소비 금액</p>
      <div class="flex flex-wrap justify-start w-full p-4 gap-3">
        <div
          v-for="(amount, month) in lastThreeMonths"
          :key="month"
          class="flex-1 min-w-[120px] p-6 rounded-3xl bg-white border border-blue-50 shadow-sm text-center"
        >
          <p class="text-xs text-gray-400 mb-2">{{ month }}</p>
          <p class="text-lg font-bold text-gray-700">₩ {{ amount.toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const yearAverage = ref(0);
const lastThreeMonths = ref({});

const fetchData = async () => {
  try {
    const response = await axios.get("http://localhost:3000/finances");
    const expenses = response.data.filter((item) => item.type === "expense");

    const monthlyTotals = expenses.reduce((acc, curr) => {
      const monthStr = curr.date.substring(0, 7); // "2026-04" 추출
      acc[monthStr] = (acc[monthStr] || 0) + curr.amount;
      return acc;
    }, {});

    const now = new Date();

    const threeMonthsData = {};
    for (let i = 1; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      threeMonthsData[mStr] = monthlyTotals[mStr] || 0;
    }
    lastThreeMonths.value = threeMonthsData;

    let totalYearExpense = 0;
    for (let i = 1; i <= 12; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const mStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      totalYearExpense += monthlyTotals[mStr] || 0;
    }
    yearAverage.value = Math.floor(totalYearExpense / 12);
  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

onMounted(() => {
  fetchData();
});
</script>
