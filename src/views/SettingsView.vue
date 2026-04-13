<script setup lang="ts">
import { ref } from "vue";
import ChangePWModal from "@/components/ChangePWModal.vue";
import UserInfo from "@/components/UserInfo.vue";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const isChangePWModalOpen = ref(false);

const handleThemeChange = (event: Event) => {
  const selectedTheme = (event.target as HTMLSelectElement).value;
  themeStore.changeTheme(selectedTheme);
};

const clickPWhandler = () => {
  authStore.errorMessage = "";
  isChangePWModalOpen.value = true;
};

const closeChangePWModal = () => {
  authStore.errorMessage = "";
  isChangePWModalOpen.value = false;
};

const submitChangePassword = async (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  authStore.errorMessage = "";

  if (payload.newPassword !== payload.confirmPassword) {
    alert("새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다.");
    return;
  }

  try {
    await authStore.changePassword({
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    });
    alert("비밀번호가 변경되었습니다.");
    closeChangePWModal();
  } catch (error: unknown) {
    console.error("비밀번호 변경 실패:", error);
    alert(authStore.errorMessage || "비밀번호 변경에 실패했습니다.");
  }
};
</script>

<template>
  <div class="container flex flex-col gap-4">
    <!-- 기본 정보 -->
    <UserInfo></UserInfo>

    <!-- 비밀번호 -->
    <div
      class="flex flex-col gap-3 bg-white p-5 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
    >
      <h2 class="small-title font-bold text-xl text-[#343434]">비밀번호 변경</h2>
      <button
        @click="clickPWhandler"
        class="mt-4 w-50 rounded-full border border-[#cfd7df] bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#2f4f6a] transition hover:bg-blue-100 hover:cursor-pointer"
      >
        비밀번호 변경
      </button>
    </div>
    <ChangePWModal
      v-if="isChangePWModalOpen"
      :is-loading="authStore.isLoading"
      @close="closeChangePWModal"
      @submit="submitChangePassword"
    />

    <!-- 라이트/다크모드 -->
    <div
      class="flex flex-col gap-3 bg-white p-5 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
    >
      <h2 class="small-title font-bold text-xl text-[#343434]">테마 설정</h2>
      <select
        :value="themeStore.theme"
        @change="handleThemeChange"
        class="mt-4 w-50 rounded-full border border-[#cfd7df] bg-white px-3.5 py-2.5 text-sm text-[#343434] outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
      >
        <option value="system">시스템 설정 사용</option>
        <option value="light">라이트 모드</option>
        <option value="dark">다크 모드</option>
      </select>
    </div>
  </div>
</template>
