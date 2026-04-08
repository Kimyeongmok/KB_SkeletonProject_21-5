import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const SESSION_KEY = "currentUser";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const isAuthenticated = computed(() => Boolean(currentUser.value));

  async function login(loginData) {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const { data } = await axios.get("/api/users", {
        params: {
          userId: loginData.userId,
          pw: loginData.pw,
        },
      });

      const user = data?.[0] ?? null;

      if (!user) {
        throw new Error("아이디 또는 비밀번호가 일치하지 않습니다.");
      }

      persistSession(user);
      return user;
    } catch (error) {
      const message = error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.";
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  function persistSession(user) {
    currentUser.value = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }

  function logout() {
    currentUser.value = null;
    localStorage.removeItem(SESSION_KEY);
  }

  function initialize() {
    const storedUser = localStorage.getItem(SESSION_KEY);

    if (!storedUser) {
      return;
    }

    try {
      currentUser.value = JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(SESSION_KEY);
      currentUser.value = null;
    }
  }

  return {
    currentUser,
    isLoading,
    errorMessage,
    isAuthenticated,
    login,
    logout,
    initialize,
  };
});
