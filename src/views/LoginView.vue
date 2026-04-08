<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  userId: 'kbstudent',
  password: 'kb1234',
})

async function handleLogin() {
  try {
    await authStore.login(form)
    router.push({ name: 'dashboard' })
  } catch {
    // 에러 문구는 스토어 값을 사용한다.
  }
}
</script>

<template>
  <main class="auth-page">
    <section class="auth-card">
      <div class="auth-copy">
        <p class="eyebrow">KB Skeleton Project 21-5</p>
        <h1>가계부 서비스 앱</h1>
        <p>
          사용자 정보와 금융 데이터를 기반으로 수입, 소비, 예산, 월별 재정 흐름을 관리하는
          Vue 3 프로젝트입니다.
        </p>
      </div>

      <form class="auth-form" @submit.prevent="handleLogin">
        <label>
          <span>사용자 아이디</span>
          <input v-model="form.userId" type="text" placeholder="아이디를 입력하세요" />
        </label>
        <label>
          <span>비밀번호</span>
          <input v-model="form.password" type="password" placeholder="비밀번호를 입력하세요" />
        </label>

        <button class="primary-button" type="submit" :disabled="authStore.isLoading">
          {{ authStore.isLoading ? '로그인 중...' : '로그인' }}
        </button>

        <p v-if="authStore.errorMessage" class="feedback error">{{ authStore.errorMessage }}</p>
        <p class="feedback hint">테스트 계정: kbstudent / kb1234</p>
      </form>
    </section>
  </main>
</template>
