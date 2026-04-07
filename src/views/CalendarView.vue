<script setup>
import FinanceCalendar from '@/components/FinanceCalendar.vue'
</script>

<template>
  <section class="dashboard-grid">
    <section class="panel full-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">소비 달력</p>
          <h2>날짜별 수입 / 지출 확인</h2>
        </div>
      </div>
      <FinanceCalendar />
    </section>
  </section>
</template>
