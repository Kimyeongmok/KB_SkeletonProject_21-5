<template>
  <div class="card" v-if="isLoaded">
    <div class="card-header">
      <h2 class="title">이번 달 설정 금액</h2>
    </div>

    <div class="progress-container">
      <div class="progress-background">
        <div class="progress-bar" :style="{ width: progressPercentage + '%' }">
          <span class="progress-text">
            {{ formatNumber(totalExpense) }} / {{ formatNumber(monthlyBudget) }}
          </span>
        </div>
      </div>
    </div>
  </div>
  <div v-else>데이터를 불러오는 중...</div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 상태 관리 변수
const dbData = ref(null);
const isLoaded = ref(false);
const currentUserId = 'user-001';
const currentMonth = '2026-04'; // 현재 날짜에 맞춰 동적으로 변경 가능

// 1. 데이터 불러오기 (db.json이 public 폴더에 있다고 가정)
onMounted(async () => {
  try {
    const response = await fetch('/db.json'); // 최상위(public) 경로의 db.json 호출
    dbData.value = await response.json();
    isLoaded.value = true;
  } catch (error) {
    console.error('데이터를 불러오는데 실패했습니다:', error);
  }
});

// 2. 이번 달 소비 금액 합산 (expense 타입만)
const totalExpense = computed(() => {
  if (!dbData.value) return 0;
  return dbData.value.finances
    .filter(
      (item) =>
        item.userId === currentUserId &&
        item.type === 'expense' &&
        item.date.startsWith(currentMonth),
    )
    .reduce((sum, item) => sum + item.amount, 0);
});

// 3. 이번 달 설정 예산 가져오기
const monthlyBudget = computed(() => {
  if (!dbData.value) return 0;
  const budget = dbData.value.budgets.find(
    (item) => item.userId === currentUserId && item.month === currentMonth,
  );
  return budget ? budget.limit : 0;
});

// 4. 진행률(%) 계산
const progressPercentage = computed(() => {
  if (monthlyBudget.value === 0) return 0;
  const percentage = (totalExpense.value / monthlyBudget.value) * 100;
  return Math.min(percentage, 100); // 100% 넘어가도 바 밖으로 안 나가게 고정
});

// 숫자 포맷 함수
const formatNumber = (num) => num.toLocaleString();
</script>

<style scoped>
/* 디자인은 이전과 동일 (이미지 스타일 재현) */
.card {
  background-color: white;
  border-radius: 25px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.05);
  padding: 30px;
  max-width: 500px;
  margin: 20px auto;
  border: 1px solid #eee;
}
.title {
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 15px;
}
.progress-background {
  height: 35px;
  background-color: #f2f2f2;
  border-radius: 20px;
  position: relative;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background-color: #7dff7d; /* 연두색 바 */
  display: flex;
  align-items: center;
  justify-content: center;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}
.progress-text {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}
</style>
