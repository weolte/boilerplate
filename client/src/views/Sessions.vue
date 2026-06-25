<script setup lang="ts">
import { useTokensStore } from '@/stores/tokens'
import { useApi } from '@/lib/api'
import { useI18n } from 'vue-i18n'
import type { SelectSessionType } from '@starter/shared/schemas'

const { t } = useI18n()

const tokensStore = useTokensStore()

const { data, isFetching } = useApi('/auth/sessions').get().json<SelectSessionType[]>()
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">{{ t('sessions.title') }}</h1>
  <div v-if="isFetching" class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div v-for="n in 4" :key="n" class="card bg-base-100 shadow-sm">
      <div class="card-body p-4">
        <div class="skeleton h-5 w-40 mb-2"></div>
        <div class="skeleton h-4 w-32 mb-1"></div>
        <div class="skeleton h-4 w-48 mb-1"></div>
        <div class="skeleton h-4 w-48"></div>
      </div>
    </div>
  </div>
  <div v-else-if="!data || data.length === 0" class="text-base-content/60">{{ t('sessions.empty') }}</div>
  <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
    <div
      v-for="session in data"
      :key="session.uuid"
      class="card bg-base-100 shadow-sm"
      :class="{ 'ring-2 ring-primary': session.userToken === tokensStore.accessToken }"
    >
      <div class="card-body p-4">
        <div class="flex items-center justify-between">
          <div class="font-medium">{{ session.userAgent || t('sessions.unknownDevice') }}</div>
          <div v-if="session.userToken === tokensStore.accessToken" class="badge badge-primary badge-sm">{{ t('sessions.current') }}</div>
        </div>
        <div class="text-sm text-base-content/60 mt-1">
          <div>{{ t('sessions.ip') }} {{ session.userIp }}</div>
          <div>{{ t('sessions.created') }} {{ new Date(session.createdAt).toLocaleString() }}</div>
          <div>{{ t('sessions.lastActive') }} {{ new Date(session.updatedAt).toLocaleString() }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
