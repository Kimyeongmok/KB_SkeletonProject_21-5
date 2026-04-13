<!-- 페이지 상단 헤더 -->
<template>
  <div class="flex items-center lg:px-60 md:px-30 py-2 px-4 bg-white border border-gray-200">
    <div class="flex flex-1 space-x-4 items-end hover:cursor-pointer" @click="router.push('/')">
      <div class="text-3xl main-title" :class="{ 'main-title--bono': isBonoMode }">
        {{ currentUserBudget }} 원으로 한 달 살기
      </div>
    </div>
    <div class="flex gap-5 items-center">
      <div
        class="flex items-center gap-2 whitespace-nowrap text-sm bg-mist-50 px-3 py-1 rounded-full shadow-sm"
      >
        <img :src="headerProfileImageSrc" alt="프로필" class="h-7 w-7 rounded-full object-cover" />
        <span class="text-blue-700">{{ userName }}</span> 님
      </div>
      <button
        type="button"
        @click="handleLogout"
        class="inline-flex h-8 items-center justify-center rounded-full pl-3 text-xs leading-none text-gray-400 hover:cursor-pointer hover:text-blue-700"
      >
        로그아웃
      </button>
      <button
        @click="goSettings"
        class="inline-flex h-8 w-8 items-center justify-center rounded-full leading-none hover:cursor-pointer"
      >
        <font-awesome-icon :icon="faSliders" class="text-gray-400 hover:text-blue-700" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { useThemeStore } from "@/stores/theme";
import profileImage1 from "@/assets/profile/Profile1.png";
import profileImage2 from "@/assets/profile/Profile2.png";
import profileImage3 from "@/assets/profile/Profile3.png";

const router = useRouter();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const dbData = ref(null);
const currentMonth = new Date().toISOString().slice(0, 7);

function handleLogout() {
  authStore.logout();
  router.push("/login");
}

// 사용자 소비 제한 금액 불러오기 - 타이틀
onMounted(async () => {
  try {
    const response = await fetch("/db.json");
    dbData.value = await response.json();
  } catch (error) {
    console.error("헤더 예산 데이터를 불러오지 못했습니다:", error);
  }
});

const currentUserId = computed(() => authStore.currentUser?.id ?? "");

const userName = computed(() => authStore.currentUser?.name ?? "사용자 이름");
const profileImageMap = {
  "Profile1.png": profileImage1,
  "Profile2.png": profileImage2,
  "Profile3.png": profileImage3,
};
const headerProfileImageSrc = computed(() => {
  const profile = authStore.currentUser?.profile || "Profile1.png";
  return profileImageMap[profile] || profileImageMap["Profile1.png"];
});
const isBonoMode = computed(() => themeStore.actualTheme === "bono");

const currentUserBudget = computed(() => {
  if (!dbData.value?.budgets || !currentUserId.value) {
    return "0";
  }

  const budget = dbData.value.budgets.find(
    (item) => item.userId === currentUserId.value && item.month === currentMonth,
  );

  if (!budget?.limit) {
    return "0";
  }

  return new Intl.NumberFormat("ko-KR").format(budget.limit);
});

// FontAwesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faSliders } from "@fortawesome/free-solid-svg-icons";

// 라우터 이동
function goSettings() {
  router.push("/settings");
}
</script>

<style scoped>
.main-title {
  font-family: "Gulim", sans-serif;
}

.main-title {
  font-family: "YeogiOttaeJalnan", sans-serif;
}

.main-title--bono {
  font-family: "Gungsuh", "궁서", serif;
  color: blue;
}

@font-face {
  font-family: "YeogiOttaeJalnan";
  src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_four@1.2/JalnanOTF00.woff")
    format("woff");
  font-weight: normal;
  font-display: swap;
}
</style>
