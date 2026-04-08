<script setup>
import Calendar from '@/components/Calendar.vue'
</script>

<template>
  <section class="dashboard-grid">
    <section class="panel full-panel calendar-page-panel">
      <div class="section-heading">
        <div>
          <p class="section-label">캘린더</p>
          <h2>날짜별 수입 / 소비 확인</h2>
        </div>
      </div>
      <Calendar />
    </section>
  </section>
</template>
