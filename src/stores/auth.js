import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'

const SESSION_KEY = 'kb-household-user'

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref(null)
  const isLoading = ref(false)
  const errorMessage = ref('')

  const isAuthenticated = computed(() => Boolean(currentUser.value))

  function restoreSession() {
    if (currentUser.value) return
    const savedUser = sessionStorage.getItem(SESSION_KEY)
    if (savedUser) currentUser.value = JSON.parse(savedUser)
  }

  function persistSession(user) {
    currentUser.value = user
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
  }

  async function login(credentials) {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const { data } = await api.get('/users', {
        params: { userId: credentials.userId, pw: credentials.password },
      })

      const user = data[0]
      if (!user) throw new Error('아이디 또는 비밀번호가 일치하지 않습니다.')
      persistSession(user)
    } catch (error) {
      errorMessage.value = error.message || '로그인에 실패했습니다.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function refreshUser() {
    if (!currentUser.value?.id) return
    const { data } = await api.get(`/users/${currentUser.value.id}`)
    persistSession(data)
  }

  function logout() {
    currentUser.value = null
    errorMessage.value = ''
    sessionStorage.removeItem(SESSION_KEY)
  }

  return {
    currentUser,
    isLoading,
    errorMessage,
    isAuthenticated,
    restoreSession,
    login,
    refreshUser,
    logout,
  }
})
