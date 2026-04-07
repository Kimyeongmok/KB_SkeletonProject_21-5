import { computed, reactive } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useFinanceStore } from '@/stores/finance'

export function useFinanceDashboard() {
  const authStore = useAuthStore()
  const financeStore = useFinanceStore()

  const filters = reactive({
    type: 'all',
    category: 'all',
    period: 'all',
    startDate: '',
    endDate: '',
    keyword: '',
  })

  const currentMonth = computed(() => new Date().toISOString().slice(0, 7))

  const categoryOptions = computed(() => {
    const categories = new Set(financeStore.transactions.map((item) => item.category))
    return Array.from(categories).sort((a, b) => a.localeCompare(b, 'ko-KR'))
  })

  const filteredTransactions = computed(() => {
    const now = new Date()

    return financeStore.sortedTransactions.filter((item) => {
      if (filters.type !== 'all' && item.type !== filters.type) {
        return false
      }

      if (filters.category !== 'all' && item.category !== filters.category) {
        return false
      }

      if (filters.keyword.trim()) {
        const keyword = filters.keyword.trim().toLowerCase()
        const searchTarget = `${item.category} ${item.memo ?? ''}`.toLowerCase()
        if (!searchTarget.includes(keyword)) {
          return false
        }
      }

      const itemDate = new Date(item.date)

      if (filters.period === 'month') {
        if (
          itemDate.getFullYear() !== now.getFullYear() ||
          itemDate.getMonth() !== now.getMonth()
        ) {
          return false
        }
      }

      if (filters.period === 'week') {
        const day = now.getDay() || 7
        const start = new Date(now)
        start.setHours(0, 0, 0, 0)
        start.setDate(now.getDate() - day + 1)
        const end = new Date(start)
        end.setDate(start.getDate() + 6)
        end.setHours(23, 59, 59, 999)

        if (itemDate < start || itemDate > end) {
          return false
        }
      }

      if (filters.period === 'custom') {
        if (filters.startDate && item.date < filters.startDate) {
          return false
        }

        if (filters.endDate && item.date > filters.endDate) {
          return false
        }
      }

      return true
    })
  })

  const summary = computed(() =>
    filteredTransactions.value.reduce(
      (acc, item) => {
        if (item.type === 'income') {
          acc.income += Number(item.amount)
        } else {
          acc.expense += Number(item.amount)
        }
        acc.balance = acc.income - acc.expense
        return acc
      },
      { income: 0, expense: 0, balance: 0 },
    ),
  )

  const currentMonthTransactions = computed(() =>
    financeStore.transactions.filter((entry) => entry.date.startsWith(currentMonth.value)),
  )

  const currentMonthSummary = computed(() =>
    currentMonthTransactions.value.reduce(
      (acc, item) => {
        if (item.type === 'income') {
          acc.income += Number(item.amount)
        } else {
          acc.expense += Number(item.amount)
        }
        acc.balance = acc.income - acc.expense
        return acc
      },
      { income: 0, expense: 0, balance: 0 },
    ),
  )

  const currentMonthChartData = computed(() => {
    const grouped = new Map()

    for (const item of currentMonthTransactions.value) {
      const key = `${item.type}-${item.category}`

      if (!grouped.has(key)) {
        grouped.set(key, {
          type: item.type,
          category: item.category,
          amount: 0,
        })
      }

      grouped.get(key).amount += Number(item.amount)
    }

    return Array.from(grouped.values()).sort((a, b) => b.amount - a.amount)
  })

  const currentBudget = computed(
    () =>
      financeStore.budgets.find(
        (budget) => budget.userId === authStore.currentUser?.id && budget.month === currentMonth.value,
      ) ?? null,
  )

  const currentMonthSpent = computed(() =>
    currentMonthTransactions.value
      .filter((item) => item.type === 'expense')
      .reduce((total, item) => total + Number(item.amount), 0),
  )

  const currentMonthIncome = computed(() =>
    currentMonthTransactions.value
      .filter((item) => item.type === 'income')
      .reduce((total, item) => total + Number(item.amount), 0),
  )

  const currentMonthTopExpenseCategories = computed(() => {
    const totalExpense = currentMonthSpent.value

    return currentMonthChartData.value
      .filter((item) => item.type === 'expense')
      .slice(0, 3)
      .map((item) => ({
        category: item.category,
        amount: item.amount,
        percent: totalExpense ? Math.round((Number(item.amount) / totalExpense) * 100) : 0,
      }))
  })

  const recentThreeMonthExpenses = computed(() => {
    const baseDate = new Date(`${currentMonth.value}-01T00:00:00`)

    return Array.from({ length: 3 }, (_, index) => {
      const targetDate = new Date(baseDate.getFullYear(), baseDate.getMonth() - index, 1)
      const monthKey = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}`
      const total = financeStore.transactions
        .filter((item) => item.type === 'expense' && item.date.startsWith(monthKey))
        .reduce((sum, item) => sum + Number(item.amount), 0)

      return {
        month: monthKey,
        label: `${targetDate.getMonth() + 1}월`,
        amount: total,
      }
    }).reverse()
  })

  const recentThreeMonthExpenseTotal = computed(() =>
    recentThreeMonthExpenses.value.reduce((sum, item) => sum + item.amount, 0),
  )

  async function handleTransactionSubmit(payload) {
    await financeStore.addTransaction({
      ...payload,
      userId: authStore.currentUser.id,
    })
  }

  async function handleTransactionDelete(transactionId) {
    await financeStore.deleteTransaction(transactionId)
  }

  async function handleBudgetSave(limit) {
    await financeStore.saveBudget({
      userId: authStore.currentUser.id,
      month: currentMonth.value,
      limit,
    })
  }

  return {
    filters,
    currentMonth,
    categoryOptions,
    filteredTransactions,
    summary,
    currentMonthTransactions,
    currentMonthSummary,
    currentMonthChartData,
    currentBudget,
    currentMonthSpent,
    currentMonthIncome,
    currentMonthTopExpenseCategories,
    recentThreeMonthExpenses,
    recentThreeMonthExpenseTotal,
    handleTransactionSubmit,
    handleTransactionDelete,
    handleBudgetSave,
  }
}
