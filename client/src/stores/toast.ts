import { ref } from 'vue'
import { defineStore } from 'pinia'

export type Toast = {
  id: number
  type: 'info' | 'success' | 'warning' | 'error'
  text: string
  duration?: number
  progress: number
}

export const useToastStore = defineStore('toast', () => {
  const toast = ref<Toast[]>([])

  function removeToast(id: number) {
    toast.value = toast.value.filter((t) => t.id !== id)
  }

  function addToast(payload: Omit<Toast, 'id' | 'progress'>) {
    const newToast: Toast = {
      id: Date.now(),
      progress: 100,
      ...payload,
    }

    toast.value.push(newToast)

    if (newToast.duration) {
      const stepTime = 50
      const totalDuration = newToast.duration
      let currentDuration = totalDuration

      const interval = setInterval(() => {
        const t = toast.value.find((t) => t.id === newToast.id)
        if (!t) {
          clearInterval(interval)
          return
        }

        currentDuration -= stepTime

        if (currentDuration <= 0) {
          t.progress = 0
          clearInterval(interval)
          setTimeout(() => removeToast(newToast.id), 300)
          return
        }

        t.progress = (currentDuration / totalDuration) * 100
      }, stepTime)
    }
  }

  return { toast, addToast, removeToast }
})
