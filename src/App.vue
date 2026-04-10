<script setup>
import { computed } from 'vue';
import { RouterView, useRoute } from 'vue-router';
import Header from '@/components/Header.vue';
import Menu from '@/components/Menu.vue';
import UserBalance from '@/components/UserBalance.vue';

const route = useRoute();
const isAuthLayout = computed(() => route.meta.layout === 'auth');
</script>

<template>
  <RouterView v-if="isAuthLayout" />

  <div v-else class="min-h-screen bg-gray-50 p-6 md:p-10">
    <header
      class="mb-10 p-4 bg-blue-100 rounded-lg border-2 border-blue-300 border-dashed text-center"
    >
      <Header />
    </header>
    <div class="p-4"></div>

    <main class="mx-auto grid max-w-8xl grid-cols-12 gap-8">
      <div class="col-span-8 space-y-6 lg:col-start-3 lg:col-span-6">
        <RouterView></RouterView>
      </div>

      <div class="col-span-4 space-y-6 lg:col-span-2">
        <div><UserBalance /></div>
        <div class="p-4"></div>
        <div><Menu /></div>
      </div>
    </main>

    <div class="p-4"></div>

    <footer class="mt-16 p-6 text-center text-sm text-gray-500 space-y-1">
      <p>© 2026 Project: Living on n Won. All rights reserved.</p>
      <p>Made by KO, KIM, O, Hwang</p>
    </footer>
  </div>
</template>

<style scoped></style>
