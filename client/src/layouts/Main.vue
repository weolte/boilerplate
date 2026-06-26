<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import MobileNav from '@/components/MobileNav.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="drawer min-h-screen overflow-x-hidden">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <Header />
      <div class="h-16 shrink-0"></div>
      <main class="flex-1 bg-linear-to-br from-base-200 to-base-300 p-4 md:p-6">
        <div class="container mx-auto">
          <RouterView />
        </div>
      </main>
      <Footer />
    </div>
    <div class="drawer-side z-40">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <MobileNav />
    </div>
  </div>
</template>