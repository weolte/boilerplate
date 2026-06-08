<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'

const router = useRouter()
const route = useRoute()
const tokensStore = useTokensStore()

const loading = ref(false)
const error = ref('')

let authWindow = null

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
    error.value = 'Failed to open authentication window'
  }
}

function handleMessage(event) {
  if (event.origin !== 'https://devhr.navoiyuran.uz') {
    return
  }

  const { accessToken, refreshToken } = event.data || {}

  if (!accessToken || !refreshToken) {
    return
  }
  console.log(event);

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
  <div class="hero min-h-screen bg-base-200">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-4xl font-bold">Authentication Required</h1>

        <p class="py-6 text-base-content/70">
          You need to sign in to access this application.
        </p>

        <button class="btn btn-primary btn-lg" :disabled="loading" @click="login">
          <span v-if="loading" class="loading loading-spinner loading-sm" />

          {{ loading ? 'Waiting for authentication...' : 'Sign In' }}
        </button>

        <div v-if="error" class="alert alert-error mt-6">
          <span>{{ error }}</span>
        </div>
      </div>
    </div>
  </div>
</template>