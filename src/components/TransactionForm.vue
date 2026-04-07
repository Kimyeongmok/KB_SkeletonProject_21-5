<script setup>
import { computed, reactive } from 'vue'

const emit = defineEmits(['submit-transaction'])

const categoryMap = {
  income: ['급여', '부수입', '용돈', '환급', '기타수입'],
  expense: ['식비', '교통', '주거', '쇼핑', '문화', '의료', '기타지출'],
}

const form = reactive({
  type: 'expense',
  date: new Date().toISOString().slice(0, 10),
  amount: '',
  category: '식비',
  memo: '',
})

const errorMessage = reactive({ text: '' })
const categories = computed(() => categoryMap[form.type])

function switchType(type) {
  form.type = type
  form.category = categoryMap[type][0]
}

async function handleSubmit() {
  if (!form.date || !form.amount || Number(form.amount) <= 0) {
    errorMessage.text = '날짜와 0보다 큰 금액은 필수입니다.'
    return
  }

  await emit('submit-transaction', {
    type: form.type,
    date: form.date,
    amount: Number(form.amount),
    category: form.category,
    memo: form.memo.trim(),
  })

  errorMessage.text = ''
  form.amount = ''
  form.memo = ''
}
</script>

<template>
  <section>
    <div class="section-heading">
      <div>
        <p class="section-label">거래 입력</p>
        <h2>수입 / 지출 기록</h2>
      </div>
    </div>

    <div class="type-toggle">
      <button class="toggle-pill" :class="{ active: form.type === 'income' }" type="button" @click="switchType('income')">수입</button>
      <button class="toggle-pill" :class="{ active: form.type === 'expense' }" type="button" @click="switchType('expense')">지출</button>
    </div>

    <form class="stack-form" @submit.prevent="handleSubmit">
      <label>
        <span>날짜</span>
        <input v-model="form.date" type="date" />
      </label>
      <label>
        <span>금액</span>
        <input v-model="form.amount" type="number" min="0" placeholder="예: 50000" />
      </label>
      <label>
        <span>카테고리</span>
        <select v-model="form.category">
          <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
        </select>
      </label>
      <label>
        <span>메모</span>
        <input v-model="form.memo" type="text" placeholder="거래 메모 입력" />
      </label>

      <button class="primary-button" type="submit">기록 저장</button>
      <p v-if="errorMessage.text" class="feedback error">{{ errorMessage.text }}</p>
    </form>
  </section>
</template>
