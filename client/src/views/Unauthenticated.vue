<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const tokensStore = useTokensStore()

const loading = ref(false)
const error = ref('')

let authWindow: Window | null = null

function login() {
  loading.value = true
  error.value = ''

  authWindow = window.open(
    `api/auth/login`,
    'auth',
    'width=600,height=800'
  )

  if (!authWindow) {
    loading.value = false
    error.value = t('auth.failedOpen')
    return
  }
}

function handleMessage(event: MessageEvent) {
  const allowedOrigins = [
    'https://devhr.navoiyuran.uz',
    window.location.origin,
    'http://localhost:3002',
  ]
  if (!allowedOrigins.includes(event.origin)) {
    return
  }

  const { accessToken, refreshToken } = event.data || {}

  if (!accessToken || !refreshToken) {
    return
  }

  tokensStore.setTokens({
    accessToken,
    refreshToken,
  })

  loading.value = false

  if (authWindow && !authWindow.closed) {
    authWindow.close()
  }

  const redirect = route.query.redirect || '/'

  router.replace(String(redirect))
}

onMounted(() => {
  window.addEventListener('message', handleMessage)
})

onBeforeUnmount(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="hero min-h-full">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold">{{ t('auth.required') }}</h1>

        <p class="py-6 text-base-content/70">
          {{ t('auth.description') }}
        </p>

        <button class="btn btn-primary btn-lg" :disabled="loading" @click="login">
          <span v-if="loading" class="loading loading-spinner loading-sm" />

          {{ loading ? t('auth.waiting') : t('auth.signIn') }}
        </button>

        <div v-if="error" class="alert alert-error mt-6">
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>