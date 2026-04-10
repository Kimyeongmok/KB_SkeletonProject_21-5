<template>
  <div
    class="flex items-start bg-white rounded-[24px] flex-col p-6 gap-2 border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
    <div class="font-bold mb-4 text-md text-[#343434] small-title">총 자산</div>
    <div class="font-bold mb-4 text-2xl">{{ balance.toLocaleString() }}원</div>
  </div>
</template>
<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const balance = ref(0);

const fetchBalance = async () => {
  try {
    const url = "http://localhost:3000/users";
    const response = await axios.get(url);

    if (response.data && response.data.length > 0) {
      balance.value = response.data[0].balance;
    }
  } catch (error) {
    console.error("오류 발생", error);
  }
};

onMounted(() => {
  fetchBalance();
});
</script>
