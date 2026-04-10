<template>
  <div class="card" v-if="isLoaded">
    <div class="card-header">
      <h2 class="title small-title">이번 달 설정 금액</h2>
      <span class="progress-percent" :class="progressPercentClass">
        {{ progressPercentLabel }}
      </span>
    </div>

    <div class="progress-container">
      <div class="progress-background">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }"></div>
        <span class="progress-text">
          {{ formatNumber(totalExpense) }} / {{ formatNumber(monthlyBudget) }}
        </span>
      </div>
    </div>
  </div>
  <div v-else>데이터를 불러오는 중...</div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";

const apiBaseUrl = "http://localhost:3000";
const dbData = ref(null);
const isLoaded = ref(false);
const authStore = useAuthStore();
const currentUserId = computed(
  () => authStore.currentUser?.id ?? authStore.currentUser?.userId ?? "",
);
const currentMonth = new Date().toISOString().slice(0, 7);

onMounted(async () => {
  try {
    const [financesResponse, budgetsResponse] = await Promise.all([
      fetch(`${apiBaseUrl}/finances`),
      fetch(`${apiBaseUrl}/budgets`),
    ]);

    const [finances, budgets] = await Promise.all([
      financesResponse.json(),
      budgetsResponse.json(),
    ]);

    dbData.value = { finances, budgets };
    isLoaded.value = true;
  } catch (error) {
    console.error("데이터를 불러오는데 실패했습니다:", error);
  }
});

const totalExpense = computed(() => {
  if (!dbData.value || !currentUserId.value) return 0;
  return dbData.value.finances
    .filter(
      (item) =>
        item.userId === currentUserId.value &&
        item.type === "expense" &&
        item.date.startsWith(currentMonth),
    )
    .reduce((sum, item) => sum + item.amount, 0);
});

const monthlyBudget = computed(() => {
  if (!dbData.value || !currentUserId.value) return 0;
  const budget = dbData.value.budgets.find(
    (item) => item.userId === currentUserId.value && item.month === currentMonth,
  );
  return budget ? budget.limit : 0;
});

const progressPercentage = computed(() => {
  if (monthlyBudget.value === 0) return 0;
  return (totalExpense.value / monthlyBudget.value) * 100;
});

const progressPercentLabel = computed(() => `${Math.round(progressPercentage.value)}%`);

const progressPercentClass = computed(() => {
  const percentage = progressPercentage.value;

  if (percentage < 70) return "percent-black";
  if (percentage < 80) return "percent-yellow";
  if (percentage < 90) return "percent-orange";
  return "percent-red";
});

const formatNumber = (num) => num.toLocaleString();
</script>

<style scoped>
/* 디자인은 이전과 동일 (이미지 스타일 재현) */
.card {
  background-color: white;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(71, 95, 114, 0.14);
  padding: 20px;
  width: 100%;
  max-width: none;
  margin: 0;
  border: 1px solid #cfd7df;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 15px;
}

.progress-percent {
  font-size: 30px;
  font-weight: 800;
  white-space: nowrap;
}

.percent-black {
  color: #111111;
}

.percent-yellow {
  color: #d4a700;
}

.percent-orange {
  color: #e67e22;
}

.percent-red {
  color: #d62828;
}
.progress-background {
  width: 100%;
  height: 35px;
  background-color: #f2f2f2;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #7dff7d; /* 연두색 바 */
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 600;
  font-size: 14px;
  color: #333;
  pointer-events: none;
}

@media (max-width: 640px) {
  .card {
    padding: 20px;
  }

  .card-header {
    gap: 12px;
  }

  .progress-percent {
    font-size: 16px;
  }

  .progress-background {
    height: 30px;
  }

  .progress-text {
    font-size: 12px;
  }
}
</style>
