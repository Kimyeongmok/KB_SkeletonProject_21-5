import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardLayout from '@/views/DashboardLayout.vue'
import BudgetView from '@/views/BudgetView.vue'
import CalendarView from '@/views/CalendarView.vue'
import LoginView from '@/views/LoginView.vue'
import OverviewView from '@/views/OverviewView.vue'
import TransactionsView from '@/views/TransactionsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    {
      path: '/dashboard',
      component: DashboardLayout,
      meta: { requiresAuth: true },
      children: [
        { path: '', name: 'dashboard', component: OverviewView },
        { path: 'transactions', name: 'transactions', component: TransactionsView },
        { path: 'calendar', name: 'calendar', component: CalendarView },
        { path: 'budget', name: 'budget', component: BudgetView },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()
  authStore.restoreSession()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return { name: 'dashboard' }
  }
})

export default router
