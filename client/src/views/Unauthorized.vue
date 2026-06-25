<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="hero min-h-full">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold">{{ t('unauthorized.title') }}</h1>
        <p class="py-6 text-base-content/70">
          {{ t('unauthorized.description') }}
        </p>
        <button class="btn btn-primary" @click="router.push('/')">
          {{ t('unauthorized.goHome') }}
        </button>
      </div>
    </div>
  </div>
</template>
