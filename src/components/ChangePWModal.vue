<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (
    e: "submit",
    payload: {
      currentPassword: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): void;
}>();

const currentPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

const closeModal = () => {
  emit("close");
};

const onSubmit = () => {
  emit("submit", {
    currentPassword: currentPassword.value,
    newPassword: newPassword.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>

<template>
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
    @click.self="closeModal"
  >
    <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-semibold">비밀번호 변경</h2>
        <button
          type="button"
          class="rounded px-2 py-1 text-sm text-gray-500 hover:bg-gray-100"
          @click="closeModal"
        >
          닫기
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="onSubmit">
        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">현재 비밀번호</label>
          <input
            v-model="currentPassword"
            type="password"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:border-mist-300 focus:outline-none"
            placeholder="현재 비밀번호를 입력하세요"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">새 비밀번호</label>
          <input
            v-model="newPassword"
            type="password"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:border-mist-300 focus:outline-none"
            placeholder="새 비밀번호를 입력하세요"
            required
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-gray-700">새 비밀번호 확인</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="w-full rounded border border-gray-300 px-3 py-2 focus:border-mist-300 focus:outline-none"
            placeholder="새 비밀번호를 다시 입력하세요"
            required
          />
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button
            type="button"
            class="rounded border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
            @click="closeModal"
          >
            취소
          </button>
          <button
            type="submit"
            :disabled="isLoading"
            class="rounded bg-mist-500 px-4 py-2 text-sm font-semibold text-white hover:bg-mist-600"
          >
            {{ isLoading ? "변경 중..." : "변경하기" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
