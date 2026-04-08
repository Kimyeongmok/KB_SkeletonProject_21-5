<script setup>
import { computed, ref, watch } from 'vue'
import { formatCurrency } from '@/utils/format'

const props = defineProps({
  month: { type: String, required: true },
  budget: { type: Number, default: 0 },
  spent: { type: Number, default: 0 },
})

const emit = defineEmits(['save-budget'])
const budgetInput = ref(String(props.budget || ''))

watch(
  () => props.budget,
  (value) => {
    budgetInput.value = value ? String(value) : ''
  },
  { immediate: true },
)

const remain = computed(() => Number(props.budget || 0) - Number(props.spent || 0))

function submitBudget() {
  emit('save-budget', Number(budgetInput.value) || 0)
}
</script>

<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="section-label">예산 설정</p>
        <h2>{{ month }} 소비 한도</h2>
      </div>
    </div>

    <div class="budget-stats">
      <div>
        <span>설정 예산</span>
        <strong>{{ formatCurrency(budget) }}</strong>
      </div>
      <div>
        <span>현재 소비</span>
        <strong>{{ formatCurrency(spent) }}</strong>
      </div>
      <div>
        <span>남은 금액</span>
        <strong :class="{ negative: remain < 0 }">{{ formatCurrency(remain) }}</strong>
      </div>
    </div>

    <div class="inline-form">
      <input v-model="budgetInput" type="number" min="0" placeholder="예산 금액 입력" />
      <button class="primary-button" type="button" @click="submitBudget">예산 저장</button>
    </div>
  </section>
</template>
