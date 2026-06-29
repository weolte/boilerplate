<script setup lang="ts">
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen bg-linear-to-br from-base-200 via-base-300 to-base-200 flex flex-col">
    <header class="navbar bg-base-100/50 backdrop-blur-md w-full border-b border-base-300/50">
      <div class="container mx-auto flex items-center gap-2 px-4">
        <button class="btn btn-ghost text-lg font-semibold">{{ t('logo') }}</button>
        <div class="flex-1" />
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
    <div class="flex-1 flex items-center justify-center p-4">
      <RouterView />
    </div>
  </div>
</template>