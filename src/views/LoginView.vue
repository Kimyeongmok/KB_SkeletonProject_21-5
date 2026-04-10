<template>
  <section class="flex min-h-screen items-center justify-center px-4 py-10 bg-gray-50">
    <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg flex flex-col gap-8">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">가계부 로그인</h1>
        <p class="mt-2 text-sm text-slate-500">json-server 사용자 정보로 로그인하세요.</p>
      </div>
      <form class="mt-6 space-y-4 flex flex-col gap-2" @submit.prevent="handleLogin">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="userEmail"
            >이메일</label
          >
          <input
            id="userEmail"
            v-model.trim="form.userEmail"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            type="email"
            autocomplete="username"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="pw">비밀번호</label>
          <input
            id="pw"
            v-model="form.pw"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            type="password"
            autocomplete="current-password"
            required
          />
        </div>

        <p class="min-h-[1.25rem] text-sm text-red-600">
          {{ authStore.errorMessage }}
        </p>

        <button
          class="w-full rounded-lg bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          type="submit"
          :disabled="authStore.isLoading"
        >
          {{ authStore.isLoading ? "로그인 중..." : "로그인" }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = reactive({
  userEmail: "kbstudent@abc.com",
  pw: "kb1234",
});

async function handleLogin() {
  try {
    await authStore.login(form);
    router.push("/home");
  } catch {
    // 에러 메시지는 store.errorMessage에 저장됨
  }
}
</script>
