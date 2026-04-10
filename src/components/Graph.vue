<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";

const palette = ["#f4c542", "#4f8cff", "#28c76f", "#ff7a59", "#8b5cf6", "#14b8a6"];

const finances = ref([]);
const isLoading = ref(true);
const errorMessage = ref("");

function formatCurrency(value) {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function groupByCategory(items) {
  const grouped = items.reduce((acc, item) => {
    const category = item.category || "기타";
    const amount = Number(item.amount) || 0;

    acc[category] = (acc[category] || 0) + amount;
    return acc;
  }, {});

  return Object.entries(grouped).map(([category, amount]) => ({
    category,
    amount,
  }));
}

function buildChartSegments(items) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  if (!total) {
    return {
      total: 0,
      segments: [],
      gradient: "conic-gradient(#e5e7eb 0deg 360deg)",
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
      .map((segment) => `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`)
      .join(", ")})`,
  };
}

function getTopSegments(chart) {
  const sortedSegments = [...chart.segments].sort(
    (a, b) => b.percent - a.percent || b.amount - a.amount,
  );
  const topSegments = sortedSegments.slice(0, 3);
  const remainingSegments = sortedSegments.slice(3);

  if (!remainingSegments.length) {
    return topSegments;
  }

  const otherAmount = remainingSegments.reduce((sum, segment) => sum + segment.amount, 0);
  const otherPercent = remainingSegments.reduce((sum, segment) => sum + segment.percent, 0);

  return [
    ...topSegments,
    {
      category: "기타",
      amount: otherAmount,
      percent: otherPercent,
      color: "#9ca3af",
    },
  ];
}

async function loadFinances() {
  try {
    const { data } = await axios.get("http://localhost:3000/finances");
    finances.value = Array.isArray(data) ? data : [];
    errorMessage.value = "";
  } catch (error) {
    finances.value = [];
    errorMessage.value = "서버에서 그래프 데이터를 불러오지 못했습니다.";
  } finally {
    isLoading.value = false;
  }
}

const availableMonths = computed(() =>
  [...new Set(finances.value.map((item) => item.date?.slice(0, 7)).filter(Boolean))].sort(),
);

const currentMonth = new Date().toISOString().slice(0, 7);

const selectedMonth = computed(() => {
  if (availableMonths.value.includes(currentMonth)) {
    return currentMonth;
  }

  return availableMonths.value.at(-1) || currentMonth;
});

const monthlyItems = computed(() =>
  finances.value.filter((item) => item.date?.startsWith(selectedMonth.value)),
);

const incomeChart = computed(() =>
  buildChartSegments(groupByCategory(monthlyItems.value.filter((item) => item.type === "income"))),
);

const expenseChart = computed(() =>
  buildChartSegments(groupByCategory(monthlyItems.value.filter((item) => item.type === "expense"))),
);

const incomeTopSegments = computed(() => getTopSegments(incomeChart.value));
const expenseTopSegments = computed(() => getTopSegments(expenseChart.value));

onMounted(() => {
  loadFinances();
});
</script>

<template>
  <div class="chart-board">
    <article class="chart-card">
      <div class="chart-header">
        <div>
          <p class="small-title">이번 달 수입 / 소비 통계</p>
          <h3>{{ selectedMonth }}</h3>
        </div>
      </div>

      <p v-if="isLoading" class="feedback">그래프 데이터를 불러오는 중입니다.</p>
      <p v-else-if="errorMessage" class="feedback">{{ errorMessage }}</p>
      <div v-else-if="incomeChart.total || expenseChart.total" class="chart-grid">
        <section class="chart-panel">
          <div class="chart-panel-header">
            <p class="panel-label">수입</p>
          </div>

          <div v-if="incomeChart.total" class="chart-body">
            <div class="donut-wrap">
              <div class="donut-chart" :style="{ background: incomeChart.gradient }">
                <div class="donut-hole">
                  <span>수입</span>
                  <strong>{{ formatCurrency(incomeChart.total) }}</strong>
                </div>
              </div>
            </div>

            <div class="chart-legend">
              <div v-for="segment in incomeTopSegments" :key="segment.category" class="legend-item">
                <span class="legend-dot" :style="{ backgroundColor: segment.color }"></span>
                <div class="legend-copy">
                  <strong>{{ segment.category }} {{ segment.percent }}%</strong>
                  <span>{{ formatCurrency(segment.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="feedback">해당 월의 수입 데이터가 없습니다.</p>
        </section>

        <section class="chart-panel">
          <div class="chart-panel-header">
            <p class="panel-label">소비</p>
          </div>

          <div v-if="expenseChart.total" class="chart-body">
            <div class="donut-wrap">
              <div class="donut-chart" :style="{ background: expenseChart.gradient }">
                <div class="donut-hole">
                  <span>소비</span>
                  <strong>{{ formatCurrency(expenseChart.total) }}</strong>
                </div>
              </div>
            </div>

            <div class="chart-legend">
              <div
                v-for="segment in expenseTopSegments"
                :key="segment.category"
                class="legend-item"
              >
                <span class="legend-dot" :style="{ backgroundColor: segment.color }"></span>
                <div class="legend-copy">
                  <strong>{{ segment.category }} {{ segment.percent }}%</strong>
                  <span>{{ formatCurrency(segment.amount) }}</span>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="feedback">해당 월의 소비 데이터가 없습니다.</p>
        </section>
      </div>
      <p v-else class="feedback">해당 월에 수입과 소비 데이터가 없습니다.</p>
    </article>
  </div>
</template>

<style scoped>
.chart-board {
  padding: 0;
}

.chart-card {
  border: 1px solid #cfd7df;
  border-radius: 24px;
  box-shadow: 0 4px 12px rgba(71, 95, 114, 0.14);
  padding: 20px;
  background: #ffffff;
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
  font-size: 1rem;
  font-weight: bold;
  color: #111827;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1.5rem;
}

.chart-panel {
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.7);
  min-width: 0;
}

.chart-panel-header {
  margin-bottom: 1rem;
}

.panel-label {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  color: #374151;
}

.chart-body {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
}

.donut-wrap {
  display: flex;
  justify-content: center;
}

.donut-chart {
  width: clamp(148px, 18vw, 180px);
  aspect-ratio: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.donut-hole {
  width: clamp(92px, 11vw, 108px);
  aspect-ratio: 1;
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
  font-size: clamp(0.82rem, 1.5vw, 0.95rem);
  color: #111827;
  word-break: keep-all;
}

.chart-legend {
  display: grid;
  gap: 0.75rem;
  min-width: 0;
  width: 100%;
}

.legend-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 0;
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
  min-width: 0;
}

.legend-copy strong {
  font-size: 0.95rem;
  color: #111827;
  line-height: 1.35;
  overflow-wrap: anywhere;
}

.legend-copy span,
.feedback {
  font-size: 0.9rem;
  color: #6b7280;
  overflow-wrap: anywhere;
}

@media (max-width: 1100px) {
  .chart-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .chart-panel {
    padding: 1rem;
  }
}
</style>
