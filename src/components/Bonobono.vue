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
    class="pointer-events-none fixed bottom-4 right-4 z-50 w-28 sm:w-36 md:w-44"
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
