<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAccessTokenStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const accessTokenStore = useAccessTokenStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function login() {
  if (!email.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value, password: password.value }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      error.value = body?.message || t('auth.failed')
      return
    }

    const { accessToken } = await res.json()

    accessTokenStore.set(accessToken)

    const redirect = route.query.redirect || '/'
    router.replace(String(redirect))
  } catch {
    error.value = t('auth.failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="w-full max-w-sm">
    <div class="card bg-base-100/70 backdrop-blur-xl border border-base-300/40 shadow-2xl">
      <div class="card-body p-6 md:p-8">
        <div class="text-center mb-2">
          <h1 class="text-2xl font-bold tracking-tight">{{ t('auth.signIn') }}</h1>
          <p class="text-sm text-base-content/60 mt-1">Welcome back</p>
        </div>

        <form @submit.prevent="login" class="fieldset gap-1">
          <label class="fieldset-label text-xs font-medium">{{ t('auth.email') }}</label>
          <input
            v-model="email"
            type="email"
            class="input w-full"
            :placeholder="t('auth.emailPlaceholder')"
            required
            autocomplete="email"
          />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('auth.password') }}</label>
          <input
            v-model="password"
            type="password"
            class="input w-full"
            :placeholder="t('auth.passwordPlaceholder')"
            required
            autocomplete="current-password"
          />

          <div v-if="error" class="alert alert-error mt-4 py-2 text-sm">
            <span>{{ error }}</span>
          </div>

          <button class="btn btn-primary mt-5 w-full" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{ loading ? t('auth.signingIn') : t('auth.signIn') }}
          </button>
        </form>

        <p class="text-center text-sm text-base-content/50 mt-4">
          {{ t('auth.noAccount') }}
          <RouterLink to="/register" class="link link-primary font-medium">{{
            t('auth.createAccount')
          }}</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
