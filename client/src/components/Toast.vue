<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const toastConfig = {
  info: {
    class: 'alert alert-soft alert-info',
    icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    progress: 'radial-progress text-info',
  },
  success: {
    class: 'alert alert-soft alert-success',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
    progress: 'radial-progress text-success',
  },
  warning: {
    class: 'alert alert-soft alert-warning',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
    progress: 'radial-progress text-warning',
  },
  error: {
    class: 'alert alert-soft alert-error',
    icon: 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z',
    progress: 'radial-progress text-error',
  },
}
</script>

<template>
  <div class="toast min-w-60 max-w-60">
    <div v-for="toastItem in toastStore.toast" :key="toastItem.id" role="alert"
      :class="toastConfig[toastItem.type].class">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="toastConfig[toastItem.type].icon" />
      </svg>
      <span>{{ toastItem.text }}</span>
      <div v-if="toastItem.duration" :class="toastConfig[toastItem.type].progress" :style="{
        '--value': toastItem.progress,
        '--size': '1rem',
        '--thickness': '2px',
      }" :aria-valuenow="toastItem.progress" role="progressbar" />
    </div>
  </div>
</template>
