<template>
  <div class="space-y-6">
    <div class="bg-white rounded-lg shadow-sm"><CurrentBudget /></div>
    <div class="p-2"></div>
    <div class="bg-white rounded-lg shadow-sm"><Summary /></div>
    <div class="p-2"></div>
    <div class="bg-white rounded-lg shadow-sm"><Graph /></div>
  </div>
</template>

<script setup>
import CurrentBudget from "@/components/CurrentBudget.vue";
import UserBalance from "@/components/UserBalance.vue";
import Summary from "@/components/Summary.vue";
import Graph from "@/components/Graph.vue";
</script>
