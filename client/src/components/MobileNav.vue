<script setup lang="ts">
import { useNavStore } from '@/stores/nav';
import MobileNavItem from './MobileNavItem.vue';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const nav = useNavStore()

function closeDrawer() {
  const drawer = document.getElementById('drawer') as HTMLInputElement
  if (drawer) drawer.checked = false
}
</script>

<template>
  <div class="flex flex-col min-h-full w-80 bg-base-100/95 backdrop-blur-lg border-r border-base-300/30">
    <div class="flex items-center justify-between p-4 border-b border-base-300/20">
      <button class="btn btn-ghost text-lg font-semibold tracking-tight px-0" @click="closeDrawer">{{ t('logo') }}</button>
      <label for="drawer" aria-label="close sidebar" class="btn btn-ghost btn-square btn-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </label>
    </div>
    <ul class="menu p-2 gap-1 flex-1">
      <MobileNavItem v-for="navItem in nav.visibleItems" :key="navItem.key" :item="navItem" @close="closeDrawer" />
    </ul>
  </div>
</template>
