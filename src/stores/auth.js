import axios from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const SESSION_KEY = "currentUser";

export const useAuthStore = defineStore("auth", () => {
  const currentUser = ref(null);
  const isLoading = ref(false);
  const errorMessage = ref("");

  const isAuthenticated = computed(() => Boolean(currentUser.value));

  async function signup(signupData) {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const userEmail = signupData.userEmail?.trim();
      const name = signupData.name?.trim();
      const pw = signupData.pw?.trim();

      if (!name || !userEmail || !pw) {
        throw new Error("이름, 이메일, 비밀번호를 모두 입력해 주세요.");
      }

      const { data: existingUsers } = await axios.get("/api/users", {
        params: { userEmail },
      });

      if (existingUsers?.length) {
        throw new Error("이미 가입된 이메일입니다.");
      }

      const newUser = {
        id: `user-${Date.now()}`,
        name,
        userEmail,
        pw,
        balance: Number(signupData.balance) || 0,
        profile: signupData.profile || "Profile1.png",
      };

      const { data: createdUser } = await axios.post("/api/users", newUser);
      persistSession(createdUser);
      return createdUser;
    } catch (error) {
      const message = error instanceof Error ? error.message : "회원가입 중 오류가 발생했습니다.";
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }
  async function login(loginData) {
    isLoading.value = true;
    errorMessage.value = "";

    try {
      const userEmail = loginData.userEmail ?? loginData.userId;

      const { data } = await axios.get("/api/users", {
        params: {
          userEmail,
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
      refreshCurrentUser().catch(() => {});
    } catch {
      localStorage.removeItem(SESSION_KEY);
      currentUser.value = null;
    }
  }

  async function updateUser(updatedData) {
    try {
      isLoading.value = true;
      errorMessage.value = "";

      if (!currentUser.value) {
        throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      }

      const updatedUser = { ...currentUser.value, ...updatedData };

      // email 필드 제거 (userEmail만 사용)
      const { email, ...userDataToSave } = updatedUser;

      // API를 통해 사용자 정보 업데이트
      await axios.put(`/api/users/${currentUser.value.id}`, userDataToSave);
      return await refreshCurrentUser();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "사용자 정보 수정 중 오류가 발생했습니다.";
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function changePassword({ currentPassword, newPassword }) {
    try {
      isLoading.value = true;
      errorMessage.value = "";

      if (!currentUser.value) {
        throw new Error("로그인 정보가 없습니다. 다시 로그인해 주세요.");
      }

      const { data: latestUser } = await axios.get(`/api/users/${currentUser.value.id}`);

      if (!latestUser) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }

      if (String(latestUser.pw).trim() !== String(currentPassword).trim()) {
        throw new Error("현재 비밀번호가 일치하지 않습니다.");
      }

      await axios.patch(`/api/users/${currentUser.value.id}`, {
        pw: newPassword,
      });

      return await refreshCurrentUser();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "비밀번호 변경 중 오류가 발생했습니다.";
      errorMessage.value = message;
      throw error;
    } finally {
      isLoading.value = false;
    }
  }

  async function refreshCurrentUser() {
    if (!currentUser.value) {
      return null;
    }

    try {
      const { data } = await axios.get(`/api/users/${currentUser.value.id}`);

      if (!data) {
        throw new Error("사용자 정보를 찾을 수 없습니다.");
      }

      persistSession(data);
      return data;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "사용자 정보 새로고침 중 오류가 발생했습니다.";
      errorMessage.value = message;
      throw error;
    }
  }

  return {
    currentUser,
    isLoading,
    errorMessage,
    isAuthenticated,
    signup,
    login,
    logout,
    initialize,
    updateUser,
    changePassword,
    refreshCurrentUser,
  };
});
