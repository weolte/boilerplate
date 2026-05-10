<script setup lang="ts">
import MainLayout from '@/layouts/Main.vue'
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const { t } = useI18n()
const router = useRouter()
const apiRoutes = ref<{ url: string }[]>([])

onMounted(async () => {
  const response = await fetch('/api/routes')
  const result = await response.json()
  apiRoutes.value = result
})
</script>

<template>
  <MainLayout>
    <div class="p-2 flex flex-col gap-2">
      <div class="card p-4 bg-base-100">
        <div>App routes</div>
        <div v-for="route in router.getRoutes()">
          {{ route.path }}
        </div>
      </div>
      <div class="card p-4 bg-base-100">
        <div>Api routes</div>
        <div v-for="route in apiRoutes">
          {{ route.url }}
        </div>
      </div>
    </div>
  </MainLayout>
</template>
