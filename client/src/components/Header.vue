<script setup lang="ts">
import LocaleSwitcher from './LocaleSwitcher.vue'
import ThemeSwitcher from './ThemeSwitcher.vue'
import DesktopNav from './DesktopNav.vue'
import { useAccessTokenStore } from '@/stores/tokens'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tokensStore = useAccessTokenStore()
const router = useRouter()

async function logout() {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${tokensStore.token}`,
      },
    })
  } finally {
    tokensStore.clear()
    router.replace('/login')
  }
}
</script>

<template>
  <header class="navbar bg-base-100 fixed top-0 z-30">
    <div class="container mx-auto flex items-center gap-2">
      <div class="flex-none lg:hidden">
        <label for="drawer" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
            />
          </svg>
        </label>
      </div>
      <button class="btn btn-ghost text-lg font-semibold tracking-tight">{{ t('logo') }}</button>
      <div class="hidden flex-none lg:block">
        <DesktopNav />
      </div>
      <div class="flex-1" />
      <ThemeSwitcher />
      <LocaleSwitcher />
      <button
        class="btn btn-ghost btn-square tooltip tooltip-bottom tooltip-end"
        data-tip="Logout"
        @click="logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
          />
        </svg>
      </button>
    </div>
  </header>
</template>
