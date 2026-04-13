<template>
  <section class="signup-page flex min-h-screen items-center justify-center px-4 py-10">
    <div class="signup-card flex w-full max-w-md flex-col gap-8 rounded-lg p-8 shadow-lg">
      <div>
        <h1 class="signup-title text-2xl font-bold small-title">회원가입</h1>
        <p class="signup-subtitle mt-2 text-sm">가계부를 사용할 계정을 만드세요.</p>
      </div>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleSignup">
        <div>
          <label class="signup-label mb-1 block text-sm font-medium" for="name">이름</label>
          <input
            id="name"
            v-model.trim="form.name"
            class="signup-input w-full rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500"
            type="text"
            autocomplete="name"
            required
          />
        </div>

        <div>
          <label class="signup-label mb-1 block text-sm font-medium" for="userEmail">이메일</label>
          <input
            id="userEmail"
            v-model.trim="form.userEmail"
            class="signup-input w-full rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500"
            type="email"
            autocomplete="username"
            required
          />
        </div>

        <div>
          <label class="signup-label mb-1 block text-sm font-medium" for="pw">비밀번호</label>
          <input
            id="pw"
            v-model="form.pw"
            class="signup-input w-full rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="signup-label mb-1 block text-sm font-medium" for="confirmPw">비밀번호 확인</label>
          <input
            id="confirmPw"
            v-model="form.confirmPw"
            class="signup-input w-full rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="signup-label mb-1 block text-sm font-medium" for="balance">초기 잔액</label>
          <input
            id="balance"
            v-model.number="form.balance"
            class="signup-input w-full rounded-lg border px-3 py-2 outline-none transition focus:border-blue-500"
            type="number"
            min="0"
            step="1"
          />
        </div>

        <p class="min-h-[1.25rem] text-sm text-red-600">
          {{ errorMessage }}
        </p>

        <button
          class="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          type="submit"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? "가입 중..." : "회원가입" }}
        </button>

        <p class="signup-footer text-center text-sm">
          이미 계정이 있으신가요?
          <RouterLink class="signup-link font-semibold" to="/login">
            로그인
          </RouterLink>
        </p>
      </form>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const localErrorMessage = ref("");

const form = reactive({
  name: "",
  userEmail: "",
  pw: "",
  confirmPw: "",
  balance: 0,
});

const errorMessage = computed(() => localErrorMessage.value || authStore.errorMessage);

async function handleSignup() {
  localErrorMessage.value = "";

  if (form.pw !== form.confirmPw) {
    localErrorMessage.value = "비밀번호가 일치하지 않습니다.";
    return;
  }

  try {
    await authStore.signup(form);
    router.push("/home");
  } catch {
    // 에러 메시지는 authStore.errorMessage에 저장됨
  }
}
</script>

<style scoped>
.signup-page {
  background: var(--color-background);
  color: var(--color-text);
}

.signup-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.signup-title {
  color: var(--color-heading);
}

.signup-subtitle,
.signup-label,
.signup-footer {
  color: var(--color-text);
}

.signup-input {
  background: var(--color-background);
  border-color: var(--color-border);
  color: var(--color-text);
}

.signup-input:focus {
  box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.2);
}

.signup-link {
  color: #0369a1;
}

.signup-link:hover {
  color: #075985;
}

:global(.dark) .signup-link {
  color: #7dd3fc;
}

:global(.dark) .signup-link:hover {
  color: #bae6fd;
}
</style>