<script setup>
defineProps({
  categories: { type: Array, default: () => [] },
})

const filters = defineModel({ required: true })

const periodOptions = [
  { label: '전체', value: 'all' },
  { label: '이번 달', value: 'month' },
  { label: '이번 주', value: 'week' },
  { label: '직접 선택', value: 'custom' },
]
</script>

<template>
  <div class="filter-grid">
    <label>
      <span>유형</span>
      <select v-model="filters.type">
        <option value="all">전체</option>
        <option value="income">수입</option>
        <option value="expense">지출</option>
      </select>
    </label>

    <label>
      <span>카테고리</span>
      <select v-model="filters.category">
        <option value="all">전체</option>
        <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
      </select>
    </label>

    <label>
      <span>기간</span>
      <select v-model="filters.period">
        <option v-for="option in periodOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </label>

    <label>
      <span>검색어</span>
      <input v-model="filters.keyword" type="text" placeholder="메모 또는 카테고리 검색" />
    </label>

    <label v-if="filters.period === 'custom'">
      <span>시작일</span>
      <input v-model="filters.startDate" type="date" />
    </label>

    <label v-if="filters.period === 'custom'">
      <span>종료일</span>
      <input v-model="filters.endDate" type="date" />
    </label>
  </div>
</template>
