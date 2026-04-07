import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { api } from '@/services/api'
import { useAuthStore } from '@/stores/auth'

export const useFinanceStore = defineStore('finance', () => {
  const transactions = ref([])
  const budgets = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  function getTransactionTimestamp(item) {
    const time = item.time ? `${item.time}:00` : '00:00:00'
    return new Date(`${item.date}T${time}`).getTime()
  }

  const sortedTransactions = computed(() =>
    [...transactions.value].sort((a, b) => getTransactionTimestamp(b) - getTransactionTimestamp(a)),
  )

  async function loadFinanceData(userId) {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const [transactionResponse, budgetResponse] = await Promise.all([
        api.get('/finances', {
          params: {
            userId,
            _sort: 'date',
            _order: 'desc',
          },
        }),
        api.get('/budgets', {
          params: {
            userId,
            _sort: 'month',
            _order: 'desc',
          },
        }),
      ])

      transactions.value = transactionResponse.data
      budgets.value = budgetResponse.data
    } catch (error) {
      errorMessage.value = '가계부 데이터를 불러오지 못했습니다.'
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function addTransaction(payload) {
    const authStore = useAuthStore()
    const { data } = await api.post('/finances', payload)
    transactions.value.unshift(data)

    if (authStore.currentUser) {
      const nextMoney =
        payload.type === 'income'
          ? Number(authStore.currentUser.money) + Number(payload.amount)
          : Number(authStore.currentUser.money) - Number(payload.amount)

      await api.patch(`/users/${authStore.currentUser.id}`, {
        money: nextMoney,
      })

      await authStore.refreshUser()
    }
  }

  async function deleteTransaction(transactionId) {
    const authStore = useAuthStore()
    const target = transactions.value.find((item) => item.id === transactionId)

    if (!target) {
      return
    }

    await api.delete(`/finances/${transactionId}`)
    transactions.value = transactions.value.filter((item) => item.id !== transactionId)

    if (authStore.currentUser) {
      const nextMoney =
        target.type === 'income'
          ? Number(authStore.currentUser.money) - Number(target.amount)
          : Number(authStore.currentUser.money) + Number(target.amount)

      await api.patch(`/users/${authStore.currentUser.id}`, {
        money: nextMoney,
      })

      await authStore.refreshUser()
    }
  }

  async function saveBudget({ userId, month, limit }) {
    const { data } = await api.get('/budgets', {
      params: {
        userId,
        month,
      },
    })

    if (data.length) {
      const { data: updated } = await api.patch(`/budgets/${data[0].id}`, {
        limit,
      })

      budgets.value = budgets.value.map((budget) => (budget.id === updated.id ? updated : budget))
      return updated
    }

    const { data: created } = await api.post('/budgets', {
      userId,
      month,
      limit,
    })

    budgets.value.unshift(created)
    return created
  }

  return {
    transactions,
    budgets,
    isLoading,
    errorMessage,
    sortedTransactions,
    loadFinanceData,
    addTransaction,
    deleteTransaction,
    saveBudget,
  }
})
