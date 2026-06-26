<script setup lang="ts">
import { useTokensStore } from '@/stores/tokens'
import { useApi } from '@/lib/api'
import { useI18n } from 'vue-i18n'
import type { SelectDeviceType } from '@starter/shared/schemas'

const { t } = useI18n()

const tokensStore = useTokensStore()

const { data, isFetching, error } = useApi('/auth/devices').get().json<SelectDeviceType[]>()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ t('devices.title') }}</h1>
      <p class="text-base-content/60 mt-1">Manage your connected devices</p>
    </div>

    <div v-if="isFetching" class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div v-for="n in 4" :key="n" class="card bg-base-100/80 border border-base-300/30 shadow-sm">
        <div class="card-body p-4">
          <div class="skeleton h-5 w-40 mb-2"></div>
          <div class="skeleton h-4 w-32 mb-1"></div>
          <div class="skeleton h-4 w-48 mb-1"></div>
          <div class="skeleton h-4 w-48"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-error shadow-lg">
      <span>{{ t('devices.error') }}</span>
    </div>

    <div v-else-if="!data || data.length === 0" class="card bg-base-100/50 border border-dashed border-base-300/50">
      <div class="card-body text-center py-12">
        <p class="text-base-content/40">{{ t('devices.empty') }}</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div
        v-for="device in data"
        :key="device.uuid"
        class="card bg-base-100/80 border shadow-sm transition-all duration-200"
        :class="device.userToken === tokensStore.accessToken
          ? 'border-primary/40 ring-1 ring-primary/20'
          : 'border-base-300/30 hover:shadow-md hover:border-base-300/60'"
      >
        <div class="card-body p-4">
          <div class="flex items-center justify-between gap-2">
            <div class="font-medium truncate">{{ device.userAgent || t('devices.unknownDevice') }}</div>
            <div v-if="device.userToken === tokensStore.accessToken" class="badge badge-primary badge-sm shrink-0">{{ t('devices.current') }}</div>
          </div>
          <div class="text-sm text-base-content/60 mt-2 space-y-0.5">
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              <span>{{ device.userIp }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>{{ t('devices.created') }} {{ new Date(device.createdAt).toLocaleString() }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-3.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span>{{ t('devices.lastActive') }} {{ new Date(device.updatedAt).toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>