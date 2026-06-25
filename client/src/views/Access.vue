<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useTokensStore } from '@/stores/tokens';
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const roles = ref<string[]>([])
const loading = ref(true)

onMounted(async () => {
  try {
    const tokensStore = useTokensStore()
    const res = await fetch('/api/casbin/all-roles', {
      headers: { Authorization: `Bearer ${tokensStore.accessToken}` },
    })
    roles.value = await res.json()
  } catch {
    roles.value = []
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('access.title') }}</h1>
  <div v-if="loading" class="space-y-2">
    <div v-for="n in 3" :key="n" class="skeleton h-5 w-40"></div>
  </div>
  <div v-else-if="roles.length === 0" class="text-base-content/60">{{ t('access.empty') }}</div>
  <ul v-else class="list-disc list-inside">
    <li v-for="role in roles" :key="role" class="py-1">
      {{ role }}
    </li>
  </ul>
</template>
