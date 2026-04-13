<script setup>
import { computed } from "vue";
import { RouterView, useRoute } from "vue-router";
import Header from "@/components/Header.vue";
import Menu from "@/components/Menu.vue";
import UserBalance from "@/components/UserBalance.vue";
import Bonobono from "@/components/Bonobono.vue";

const route = useRoute();
const isAuthLayout = computed(() => route.meta.layout === "auth");
</script>

<template>
  <RouterView v-if="isAuthLayout" />

  <div
    v-else
    class="min-h-screen transition-colors duration-300"
    :style="{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-text)',
    }"
  >
    <div class="relative z-10">
      <header>
        <Header />
      </header>
      <div class="p-4"></div>

      <main class="mx-auto grid max-w-8xl grid-cols-1 gap-4 px-4 py-2 md:grid-cols-12 md:gap-8 md:px-0 md:py-0">
        <div class="space-y-6 md:col-start-2 md:col-span-7 lg:col-start-3 lg:col-span-6">
          <RouterView></RouterView>
        </div>

        <div
          class="space-y-6 self-start md:col-start-9 md:col-span-3 lg:col-span-2 md:sticky md:top-4"
        >
          <div><UserBalance /></div>
          <div class="p-4"></div>
          <div><Menu /></div>
        </div>
      </main>

      <footer class="mt-16 p-6 text-center text-sm space-y-1 text-inherit">
        <p>© 2026 Project: Living on n Won. All rights reserved.</p>
        <p>Made by KO, KIM, O, Hwang</p>
      </footer>
    </div>

    <Bonobono />
  </div>
</template>

<style scoped></style>
