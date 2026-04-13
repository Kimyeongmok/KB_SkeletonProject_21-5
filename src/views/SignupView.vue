<template>
  <section class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-10">
    <div class="flex w-full max-w-md flex-col gap-8 rounded-lg bg-white p-8 shadow-lg">
      <div>
        <h1 class="text-2xl font-bold text-slate-800 small-title">회원가입</h1>
        <p class="mt-2 text-sm text-slate-500">가계부를 사용할 계정을 만드세요.</p>
      </div>

      <form class="mt-6 flex flex-col gap-4" @submit.prevent="handleSignup">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="name">이름</label>
          <input
            id="name"
            v-model.trim="form.name"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            type="text"
            autocomplete="name"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="userEmail">이메일</label>
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
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="confirmPw">비밀번호 확인</label>
          <input
            id="confirmPw"
            v-model="form.confirmPw"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            type="password"
            autocomplete="new-password"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="balance">초기 잔액</label>
          <input
            id="balance"
            v-model.number="form.balance"
            class="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            type="number"
            min="0"
            step="1000"
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

        <p class="text-center text-sm text-slate-600">
          이미 계정이 있으신가요?
          <RouterLink class="font-semibold text-sky-700 hover:text-sky-800" to="/login">
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