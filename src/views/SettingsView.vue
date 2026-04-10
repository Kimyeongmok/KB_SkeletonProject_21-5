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
    <div class="bg-white p-6 rounded-lg shadow-md flex flex-col">
      <h2>비밀번호 변경</h2>
      <button
        @click="clickPWhandler"
        class="border border-mist-200 bg-mist-50 hover:bg-mist-200 font-bold py-2 px-4 rounded mt-4 w-50"
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
    <div class="bg-white p-6 rounded-lg shadow-md">
      <h2>테마 설정</h2>
      <select
        :value="themeStore.theme"
        @change="handleThemeChange"
        class="mt-4 w-50 rounded border border-gray-300 bg-white px-3 py-2 focus:border-blue-500 focus:outline-none"
      >
        <option value="system">시스템 설정 사용</option>
        <option value="light">라이트 모드</option>
        <option value="dark">다크 모드</option>
      </select>
    </div>
  </div>
</template>
