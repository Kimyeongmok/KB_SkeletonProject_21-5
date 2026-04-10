<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import UserBalance from "@/components/UserBalance.vue";

const route = useRoute();
const isAuthLayout = computed(() => route.meta.layout === "auth");
</script>

<template>
  <RouterView v-if="isAuthLayout" />

  <div v-else class="min-h-screen bg-gray-50">
    <header>
      <Header />
    </header>
    <div class="p-4"></div>

    <main class="mx-auto grid max-w-8xl grid-cols-12 gap-4 md:gap-8 px-4 py-2 md:px-0 md:py-0">
      <div class="col-span-8 space-y-6 md:col-start-2 md:col-span-7 lg:col-start-3 lg:col-span-6">
        <RouterView></RouterView>
      </div>

      <div class="col-span-4 space-y-6 md:col-start-9 md:col-span-3 lg:col-span-2">
        <div><UserBalance /></div>
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
