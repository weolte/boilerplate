<script setup lang="ts">
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import DesktopNav from './DesktopNav.vue';
</script>

<template>
  <header class="navbar bg-base-100 w-full gap-2">
    <div class="flex-none lg:hidden">
      <label for="drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </label>
    </div>
    <button class="btn btn-ghost">Logo</button>
    <div class="hidden flex-none lg:block">
      <DesktopNav />
    </div>
    <div class="flex-1"></div>

    <ThemeSwitcher />
    <LocaleSwitcher />
    <div class="avatar">
      <div class="w-10 rounded">
        <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
      </div>
    </div>
  </header>
</template>
