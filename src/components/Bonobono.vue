<script setup>
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useBudgetProgressStore } from "@/stores/budgetProgress";
import bonobonoImage from "@/assets/bonobono.png";
import bonobonoRedImage from "@/assets/bonobono_red.png";

const themeStore = useThemeStore();
const budgetProgressStore = useBudgetProgressStore();
const redOpacity = computed(() => budgetProgressStore.progressPercentage / 100);
</script>

<template>
  <div
    v-if="themeStore.actualTheme === 'bono'"
    class="pointer-events-none fixed bottom-2 right-2 z-0 w-20 opacity-90 sm:bottom-4 sm:right-4 sm:w-28 sm:opacity-100 md:w-44"
  >
    <img :src="bonobonoImage" alt="보노보노" class="block w-full" />
    <img
      :src="bonobonoRedImage"
      alt="보노보노 오버레이"
      class="absolute inset-0 h-full w-full object-contain transition-opacity duration-300"
      :style="{ opacity: redOpacity }"
    />
  </div>
</template>
