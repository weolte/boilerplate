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
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ t('access.title') }}</h1>
      <p class="text-base-content/60 mt-1">Role-based access control</p>
    </div>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 3" :key="n" class="skeleton h-10 w-60"></div>
    </div>

    <div v-else-if="roles.length === 0" class="card bg-base-100/50 border border-dashed border-base-300/50">
      <div class="card-body text-center py-12">
        <p class="text-base-content/40">{{ t('access.empty') }}</p>
      </div>
    </div>

    <div v-else class="card bg-base-100/80 border border-base-300/30 shadow-sm">
      <div class="card-body p-0">
        <div class="divide-y divide-base-300/30">
          <div v-for="role in roles" :key="role"
            class="flex items-center gap-3 px-5 py-3 hover:bg-base-200/50 transition-colors duration-150">
            <div class="size-2 rounded-full bg-primary shrink-0" />
            <span class="font-medium">{{ role }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>