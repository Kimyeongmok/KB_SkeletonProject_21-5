<template>
  <div
    class="flex flex-col gap-5 bg-white p-5 rounded-[24px] border border-[#cfd7df] shadow-[0_4px_12px_rgba(71,95,114,0.14)]"
  >
    <h2 class="text-xl font-bold mb-4 text-[#343434] small-title">사용자 정보</h2>
    <div v-if="userInfo" class="flex flex-col gap-5 w-full">
      <div class="flex justify-center w-full mb-3">
        <img
          :src="profileImageSrc"
          alt="프로필"
          class="w-16 h-16 rounded-full mx-auto border border-blue-100 object-cover"
        />
      </div>

      <div class="flex flex-col gap-2">
        <p class="text-sm font-bold text-[#343434]">프로필 사진 선택</p>
        <div class="flex flex-wrap justify-center gap-2">
          <button
            v-for="profile in profileOptions"
            :key="profile.value"
            type="button"
            @click="selectProfile(profile.value)"
            class="rounded-xl border p-1.5 transition hover:border-blue-300 hover:bg-blue-50"
            :class="
              selectedProfile === profile.value
                ? 'border-blue-400 bg-blue-50'
                : 'border-[#cfd7df] bg-white'
            "
          >
            <img
              :src="profile.image"
              :alt="profile.label"
              class="h-12 w-12 rounded-lg object-cover"
            />
          </button>
        </div>
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
import profileImage1 from "@/assets/profile/Profile1.png";
import profileImage2 from "@/assets/profile/Profile2.png";
import profileImage3 from "@/assets/profile/Profile3.png";

const authStore = useAuthStore();
const userInfo = computed(() => authStore.currentUser);
const profileOptions = [
  { value: "Profile1.png", label: "프로필 1", image: profileImage1 },
  { value: "Profile2.png", label: "프로필 2", image: profileImage2 },
  { value: "Profile3.png", label: "프로필 3", image: profileImage3 },
];
const profileImageMap = {
  "Profile1.png": profileImage1,
  "Profile2.png": profileImage2,
  "Profile3.png": profileImage3,
};
const selectedProfile = ref(userInfo.value?.profile || "Profile1.png");
const profileImageSrc = computed(
  () => profileImageMap[selectedProfile.value] || profileImageMap["Profile1.png"],
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
    selectedProfile.value = value?.profile || "Profile1.png";
  },
  { immediate: true },
);

const selectProfile = (profile) => {
  selectedProfile.value = profile;
};

const saveUserInfo = async () => {
  localErrorMessage.value = "";

  try {
    await authStore.updateUser({
      name: editData.value.name,
      userEmail: editData.value.userEmail,
      profile: selectedProfile.value,
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
  selectedProfile.value = userInfo.value?.profile || "Profile1.png";
};

const isLoading = computed(() => authStore.isLoading);
</script>
