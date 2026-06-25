<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="text-center">
    <div class="max-w-md mx-auto mt-16">
      <div class="badge badge-error badge-lg mb-4">404</div>
      <h1 class="text-4xl font-bold mb-2">{{ t('notFound.title') }}</h1>
      <p class="text-base-content/70 mb-6">
        {{ t('notFound.description') }}
      </p>
      <div class="flex justify-center gap-3">
        <router-link to="/" class="btn btn-primary">
          {{ t('notFound.goHome') }}
        </router-link>
        <button class="btn btn-ghost" @click="router.back()">
          {{ t('notFound.goBack') }}
        </button>
      </div>
    </div>
  </div>
</template>