<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <div class="text-center">
    <div class="max-w-md mx-auto">
      <div class="text-8xl font-black text-base-content/10 tracking-tight">403</div>
      <h1 class="text-3xl font-bold mt-2">{{ t('unauthorized.title') }}</h1>
      <p class="text-base-content/60 mt-2 mb-8">
        {{ t('unauthorized.description') }}
      </p>
      <button class="btn btn-primary" @click="router.push('/')">
        {{ t('unauthorized.goHome') }}
      </button>
    </div>
  </div>
</template>