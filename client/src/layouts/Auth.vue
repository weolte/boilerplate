<script setup lang="ts">
import LocaleSwitcher from '@/components/LocaleSwitcher.vue'
import ThemeSwitcher from '@/components/ThemeSwitcher.vue'
import { useI18n } from 'vue-i18n'
import { RouterView } from 'vue-router'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="navbar bg-base-100 w-full">
      <div class="container mx-auto flex items-center gap-2">
        <button class="btn btn-ghost text-lg font-semibold">{{ t('logo') }}</button>
        <div class="flex-1" />
        <ThemeSwitcher />
        <LocaleSwitcher />
      </div>
    </header>
    <div class="flex-1 flex items-center justify-center p-2">
      <RouterView />
    </div>
  </div>
</template>
