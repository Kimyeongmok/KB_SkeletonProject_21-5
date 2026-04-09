<!-- 페이지 상단 헤더 -->
<template>
  <div class="flex items-center p-4 bg-blue-100">
    <div class="flex flex-1 space-x-4">
      <div class="text-lg font-bold">타이틀</div>
      <div class="font-bold">서브타이틀</div>
    </div>
    <div class="flex space-x-4">
      <div class="text-sm">{{ userName }}</div>
      <button type="button" @click="handleLogout" class="border-1">로그아웃</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

const userName = authStore.currentUser ? authStore.currentUser.name : "사용자 이름";
</script>
