<script setup>
import { computed } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  items: { type: Array, default: () => [] },
  total: { type: Number, default: 0 },
})

const maxAmount = computed(() =>
  props.items.reduce((max, item) => Math.max(max, Number(item.amount) || 0), 0),
)

function getBarHeight(amount) {
  if (!maxAmount.value) {
    return '18%'
  }

  return `${Math.max(18, Math.round((Number(amount) / maxAmount.value) * 100))}%`
}
</script>

<template>
  <section class="three-month-expense">
    <div class="three-month-header">
      <div>
        <p class="section-label">지난 3달 소비 금액</p>
        <h2>최근 3개월 소비 총액</h2>
      </div>
      <strong>{{ formatCurrency(total) }}</strong>
    </div>

    <div class="three-month-board">
      <div class="three-month-bars">
        <article v-for="item in items" :key="item.month" class="three-month-bar-card">
          <div class="three-month-bar-track">
            <div class="three-month-bar-fill" :style="{ height: getBarHeight(item.amount) }"></div>
          </div>
          <strong>{{ item.label }}</strong>
          <span>{{ formatCurrency(item.amount) }}</span>
        </article>
      </div>
    </div>
  </section>
</template>
