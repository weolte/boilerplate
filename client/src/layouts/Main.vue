<script setup lang="ts">
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import MobileNav from '@/components/MobileNav.vue';
import { RouterView } from 'vue-router'
</script>

<template>
  <div class="drawer min-h-screen">
    <input id="drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex flex-col">
      <Header />
      <div class="flex-1 bg-base-300 p-2">
        <div class="container mx-auto">
          <RouterView />
        </div>
      </div>
      <Footer />
    </div>
    <div class="drawer-side">
      <label for="drawer" aria-label="close sidebar" class="drawer-overlay"></label>
      <MobileNav />
    </div>
  </div>
</template>