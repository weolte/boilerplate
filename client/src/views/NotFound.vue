<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-base-200 px-4">
    <div class="text-center max-w-md">

      <!-- 404 badge -->
      <div class="badge badge-error badge-lg mb-4">404</div>

      <!-- Title -->
      <h1 class="text-4xl font-bold mb-2">{{ t('notFound.title') }}</h1>

      <!-- Description -->
      <p class="text-base-content/70 mb-6">
        {{ t('notFound.description') }}
      </p>

      <!-- Actions -->
      <div class="flex justify-center gap-3">
        <router-link to="/" class="btn btn-primary">
          {{ t('notFound.goHome') }}
        </router-link>

        <button class="btn btn-ghost" @click="router.back()">
          {{ t('notFound.goBack') }}
        </button>
      </div>

      <!-- Optional illustration -->
      <div class="mt-10 text-6xl opacity-20">
        🚧
      </div>
    </div>
  </div>
</template>