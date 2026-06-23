<script setup lang="ts">
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import DesktopNav from './DesktopNav.vue';
</script>

<template>
  <header class="navbar bg-base-100 w-full gap-2">
    <div class="flex-none lg:hidden">
      <button for="drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"
          class="size-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </div>
    <button class="btn btn-ghost">Logo</button>
    <div class="hidden flex-none lg:block">
      <DesktopNav />
    </div>
    <div class="flex-1"></div>

    <ThemeSwitcher />
    <LocaleSwitcher />
    <button class="-rotate-90 btn btn-square">
      <svg xmlns=" http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="red"
        class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
      </svg>
    </button>
  </header>
</template>
