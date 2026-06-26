<script setup lang="ts">
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const toastConfig = {
  info: {
    class: 'alert alert-soft alert-info shadow-lg border border-info/20',
    icon: 'm11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z',
  },
  success: {
    class: 'alert alert-soft alert-success shadow-lg border border-success/20',
    icon: 'M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
  warning: {
    class: 'alert alert-soft alert-warning shadow-lg border border-warning/20',
    icon: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z',
  },
  error: {
    class: 'alert alert-soft alert-error shadow-lg border border-error/20',
    icon: 'm9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  },
}
</script>

<template>
  <div class="toast toast-bottom toast-end min-w-72 gap-2 z-50">
    <TransitionGroup name="toast">
      <div v-for="toastItem in toastStore.toast" :key="toastItem.id" role="alert"
        :class="toastConfig[toastItem.type].class" class="backdrop-blur-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="toastConfig[toastItem.type].icon" />
        </svg>
        <span class="text-sm">{{ toastItem.text }}</span>
        <button class="btn btn-ghost btn-xs btn-square shrink-0" @click="toastStore.removeToast(toastItem.id)">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-3">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-enter-active {
  transition: all 0.3s ease-out;
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>