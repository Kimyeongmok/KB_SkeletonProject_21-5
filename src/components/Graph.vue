<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const palette = [
  '#f4c542',
  '#4f8cff',
  '#28c76f',
  '#ff7a59',
  '#8b5cf6',
  '#14b8a6',
];

const finances = ref([]);
const isLoading = ref(true);
const errorMessage = ref('');

function formatCurrency(value) {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

// 같은 카테고리 거래는 금액 합침
function groupByCategory(items) {
  const grouped = items.reduce((acc, item) => {
    const category = item.category || '기타';
    const amount = Number(item.amount) || 0;

    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
}

// 합계 대비 비율 계산해서 도넛 데이터 생성
function buildChartSegments(items) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  if (!total) {
    return {
      total: 0,
      segments: [],
      gradient: 'conic-gradient(#e5e7eb 0deg 360deg)',
    };
  }

  let startAngle = 0;
  const segments = items.map((item, index) => {
    const ratio = item.amount / total;
    const angle = ratio * 360;
    const color = palette[index % palette.length];
    const segment = {
      ...item,
      color,
      percent: Math.round(ratio * 100),
      startAngle,
      endAngle: startAngle + angle,
    };

    startAngle += angle;
    return segment;
  });

  return {
    total,
    segments,
    gradient: `conic-gradient(${segments
      .map(
        (segment) =>
          `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`,
      )
      .join(', ')})`,
  };
}

async function loadFinances() {
  try {
    const { data } = await axios.get('http://localhost:3000/finances');
    finances.value = Array.isArray(data) ? data : [];
    errorMessage.value = '';
  } catch (error) {
    finances.value = [];
    errorMessage.value = '서버에서 그래프 데이터를 불러오지 못했습니다.';
  } finally {
    isLoading.value = false;
  }
}

const availableMonths = computed(() =>
  [
    ...new Set(
      finances.value.map((item) => item.date?.slice(0, 7)).filter(Boolean),
    ),
  ].sort(),
);

const currentMonth = new Date().toISOString().slice(0, 7);

// 현재 월 데이터가 있으면 그 달을, 없으면 가장 최근 달을 default로.
const selectedMonth = computed(() => {
  if (availableMonths.value.includes(currentMonth)) {
    return currentMonth;
  }

  return availableMonths.value.at(-1) || currentMonth;
});

// 선택된 월의 거래만 추려서 수입/소비 그래프 계산에 사용
const monthlyItems = computed(() =>
  finances.value.filter((item) => item.date?.startsWith(selectedMonth.value)),
);

// 수입과 소비를 분리해서 각각 도넛 그래프 데이터 생성
const incomeChart = computed(() =>
  buildChartSegments(
    groupByCategory(
      monthlyItems.value.filter((item) => item.type === 'income'),
    ),
  ),
);

const expenseChart = computed(() =>
  buildChartSegments(
    groupByCategory(
      monthlyItems.value.filter((item) => item.type === 'expense'),
    ),
  ),
);

onMounted(() => {
  loadFinances();
});
</script>

<template>
  <div class="chart-board">
    <article class="chart-card">
      <div class="chart-header">
        <div>
          <p class="section-label">이번 달 수입</p>
          <h3>{{ selectedMonth }}</h3>
        </div>
      </div>

      <p v-if="isLoading" class="feedback">
        그래프 데이터를 불러오는 중입니다.
      </p>
      <p v-else-if="errorMessage" class="feedback">{{ errorMessage }}</p>
      <div v-else-if="incomeChart.total" class="chart-body">
        <div class="donut-wrap">
          <div
            class="donut-chart"
            :style="{ background: incomeChart.gradient }"
          >
            <div class="donut-hole">
              <span>수입</span>
              <strong>{{ formatCurrency(incomeChart.total) }}</strong>
            </div>
          </div>
        </div>

        <div class="chart-legend">
          <div
            v-for="segment in incomeChart.segments"
            :key="segment.category"
            class="legend-item"
          >
            <span
              class="legend-dot"
              :style="{ backgroundColor: segment.color }"
            ></span>
            <div class="legend-copy">
              <strong>{{ segment.category }} {{ segment.percent }}%</strong>
              <span>{{ formatCurrency(segment.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="feedback">해당 월의 수입 데이터가 없습니다.</p>
    </article>

    <article class="chart-card">
      <div class="chart-header">
        <div>
          <p class="section-label">이번 달 소비</p>
          <h3>{{ selectedMonth }}</h3>
        </div>
      </div>

      <p v-if="isLoading" class="feedback">
        그래프 데이터를 불러오는 중입니다.
      </p>
      <p v-else-if="errorMessage" class="feedback">{{ errorMessage }}</p>
      <div v-else-if="expenseChart.total" class="chart-body">
        <div class="donut-wrap">
          <div
            class="donut-chart"
            :style="{ background: expenseChart.gradient }"
          >
            <div class="donut-hole">
              <span>소비</span>
              <strong>{{ formatCurrency(expenseChart.total) }}</strong>
            </div>
          </div>
        </div>

        <div class="chart-legend">
          <div
            v-for="segment in expenseChart.segments"
            :key="segment.category"
            class="legend-item"
          >
            <span
              class="legend-dot"
              :style="{ backgroundColor: segment.color }"
            ></span>
            <div class="legend-copy">
              <strong>{{ segment.category }} {{ segment.percent }}%</strong>
              <span>{{ formatCurrency(segment.amount) }}</span>
            </div>
          </div>
        </div>
      </div>
      <p v-else class="feedback">해당 월의 소비 데이터가 없습니다.</p>
    </article>
  </div>
</template>

<style scoped>
.chart-board {
  display: grid;
  gap: 1.5rem;
  padding: 1.5rem;
}

.chart-card {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.5rem;
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
}

.chart-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.25rem;
}

.chart-header h3 {
  margin: 0.25rem 0 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #111827;
}

.section-label {
  margin: 0;
  font-size: 0.8rem;
  font-weight: 700;
  color: #6b7280;
}

.chart-body {
  display: grid;
  grid-template-columns: minmax(180px, 220px) 1fr;
  gap: 1.5rem;
  align-items: center;
}

.donut-wrap {
  display: flex;
  justify-content: center;
}

.donut-chart {
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-hole {
  width: 108px;
  height: 108px;
  border-radius: 50%;
  background: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  box-shadow: inset 0 0 0 1px #e5e7eb;
}

.donut-hole span {
  font-size: 0.85rem;
  color: #6b7280;
}

.donut-hole strong {
  font-size: 0.95rem;
  color: #111827;
}

.chart-legend {
  display: grid;
  gap: 0.75rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-dot {
  width: 0.85rem;
  height: 0.85rem;
  border-radius: 9999px;
  flex: none;
}

.legend-copy {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.legend-copy strong {
  font-size: 0.95rem;
  color: #111827;
}

.legend-copy span,
.feedback {
  font-size: 0.9rem;
  color: #6b7280;
}

@media (max-width: 768px) {
  .chart-body {
    grid-template-columns: 1fr;
  }
}
</style>
