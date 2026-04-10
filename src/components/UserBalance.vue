<template>
  <div
    class="flex items-start bg-white rounded-[24px] flex-col p-6 gap-2 border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
    <div class="font-bold mb-4 text-md text-[#343434] small-title">총 자산</div>
    <div class="font-bold mb-4 text-2xl">{{ balance.toLocaleString() }}원</div>
  </div>
</template>
<script setup>
import { computed } from "vue";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();
const balance = computed(() => Number(authStore.currentUser?.balance) || 0);
</script>
