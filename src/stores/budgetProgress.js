import { defineStore } from "pinia";
import { ref } from "vue";

export const useBudgetProgressStore = defineStore("budgetProgress", () => {
  const progressPercentage = ref(0);

  const setProgressPercentage = (value) => {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      progressPercentage.value = 0;
      return;
    }

    progressPercentage.value = Math.max(0, Math.min(parsed, 100));
  };

  return {
    progressPercentage,
    setProgressPercentage,
  };
});
