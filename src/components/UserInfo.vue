<template>
  <div
    class="flex flex-col gap-5 bg-white p-5 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
    <h2 class="text-xl font-bold mb-4 text-[#343434] small-title">사용자 정보</h2>
    <div v-if="userInfo" class="flex flex-col gap-5 w-full">
      <div class="flex justify-center w-full mb-10">
        <img
          :src="profileImageSrc"
          alt="프로필"
          class="w-20 h-20 rounded-full mb-5 mx-auto border border-blue-100"
        />
      </div>

      <form @submit.prevent="saveUserInfo" class="w-full flex flex-col gap-6">
        <div class="flex flex-col gap-2">
          <label class="block font-bold text-[#343434]"> 이름 </label>
          <input
            type="text"
            v-model="editData.name"
            class="w-full rounded-2xl border border-[#cfd7df] bg-white px-4 py-3 text-[#343434] outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div class="flex flex-col gap-2">
          <label class="block font-bold text-[#343434]"> 이메일 </label>
          <input
            type="text"
            v-model="editData.userEmail"
            class="w-full rounded-2xl border border-[#cfd7df] bg-white px-4 py-3 text-[#343434] outline-none transition focus:border-blue-300 focus:ring-2 focus:ring-blue-100"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div class="flex flex-wrap gap-2 justify-center">
          <button
            type="submit"
            :disabled="isLoading"
            class="rounded-2xl border border-[#cfd7df] bg-blue-50 px-4 py-2.5 text-sm font-bold text-[#2f4f6a] transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-500"
          >
            {{ isLoading ? "저장 중..." : "저장" }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="isLoading"
            class="rounded-2xl border border-[#d5dce3] bg-white px-4 py-2.5 text-sm font-bold text-[#5d6875] transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
          >
            취소
          </button>
        </div>
      </form>

      <p
        v-if="localErrorMessage"
        class="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600"
      >
        {{ localErrorMessage }}
      </p>
    </div>
    <div v-else class="text-center text-sm text-gray-500">
      <p>사용자 정보를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import bonoProfileImage from "@/assets/profile/Profile1.png";

const authStore = useAuthStore();
const themeStore = useThemeStore();
const userInfo = computed(() => authStore.currentUser);
const profileImageSrc = computed(() =>
  themeStore.actualTheme === "bono" ? bonoProfileImage : "https://placehold.co/700x700",
);
const editData = ref({
  name: userInfo.value?.name || "",
  userEmail: userInfo.value?.userEmail || "",
});
const localErrorMessage = ref("");

watch(
  userInfo,
  (value) => {
    editData.value = {
      name: value?.name || "",
      userEmail: value?.userEmail || "",
    };
  },
  { immediate: true },
);

const saveUserInfo = async () => {
  localErrorMessage.value = "";

  try {
    await authStore.updateUser({
      name: editData.value.name,
      userEmail: editData.value.userEmail,
    });
    alert("사용자 정보가 성공적으로 업데이트되었습니다.");
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
    localErrorMessage.value = authStore.errorMessage || "사용자 정보 수정에 실패했습니다.";
  }
};

const resetForm = () => {
  localErrorMessage.value = "";
  editData.value = {
    name: userInfo.value?.name || "",
    userEmail: userInfo.value?.userEmail || "",
  };
};

const isLoading = computed(() => authStore.isLoading);
</script>
