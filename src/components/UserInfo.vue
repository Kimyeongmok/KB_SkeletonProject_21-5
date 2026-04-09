<template>
  <div class="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
    <h2 class="text-2xl font-bold mb-4">사용자 정보</h2>
    <div v-if="userInfo" class="flex flex-col items-center w-full max-w-sm">
      <img src="https://placehold.co/500x500" alt="프로필" class="w-16 h-16 rounded-full mb-4" />

      <form @submit.prevent="saveUserInfo" class="w-full">
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2"> 이름 </label>
          <input
            type="text"
            v-model="editData.name"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이름을 입력하세요"
          />
        </div>

        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2"> 이메일 </label>
          <input
            type="text"
            v-model="editData.userEmail"
            class="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="이메일을 입력하세요"
          />
        </div>

        <div class="flex gap-2 justify-center">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            {{ isLoading ? "저장 중..." : "저장" }}
          </button>
          <button
            type="button"
            @click="resetForm"
            :disabled="isLoading"
            class="bg-gray-500 hover:bg-gray-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded"
          >
            취소
          </button>
        </div>
      </form>

      <p v-if="errorMessage" class="mt-4 text-red-500 text-sm">
        {{ errorMessage }}
      </p>
    </div>
    <div v-else class="text-center">
      <p>사용자 정보를 불러오는 중...</p>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { ref, computed } from "vue";

const authStore = useAuthStore();
const userInfo = authStore.currentUser;
const editData = ref({
  name: userInfo?.name || "",
  userEmail: userInfo?.userEmail || "",
});

const saveUserInfo = async () => {
  try {
    await authStore.updateUser({
      name: editData.value.name,
      userEmail: editData.value.userEmail,
    });
  } catch (error) {
    console.error("사용자 정보 수정 실패:", error);
  }
};

const resetForm = () => {
  editData.value = {
    name: userInfo?.name || "",
    userEmail: userInfo?.userEmail || "",
  };
};

const isLoading = computed(() => authStore.isLoading);
const errorMessage = computed(() => authStore.errorMessage);
</script>
