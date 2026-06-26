<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useTokensStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const tokensStore = useTokensStore()

const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref('')

async function register() {
  if (!username.value || !email.value || !password.value) return

  if (password.value !== confirmPassword.value) {
    error.value = t('auth.registerPasswordsMismatch')
    return
  }

  loading.value = true
  error.value = ''

  try {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: username.value,
        email: email.value,
        password: password.value,
      }),
    })

    if (!res.ok) {
      const body = await res.json().catch(() => ({}))
      error.value = body?.message || t('auth.failed')
      return
    }

    const { accessToken, refreshToken } = await res.json()

    tokensStore.setTokens({ accessToken, refreshToken })

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
          <h1 class="text-2xl font-bold tracking-tight">{{ t('auth.createAccount') }}</h1>
          <p class="text-sm text-base-content/60 mt-1">Get started with a free account</p>
        </div>

        <form @submit.prevent="register" class="fieldset gap-1">
          <label class="fieldset-label text-xs font-medium">{{ t('auth.username') }}</label>
          <input
            v-model="username"
            type="text"
            class="input w-full"
            :placeholder="t('auth.usernamePlaceholder')"
            required
            autocomplete="username"
          />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('auth.email') }}</label>
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
            :placeholder="t('auth.registerPasswordPlaceholder')"
            required
            autocomplete="new-password"
          />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('auth.confirmPassword') }}</label>
          <input
            v-model="confirmPassword"
            type="password"
            class="input w-full"
            :placeholder="t('auth.confirmPasswordPlaceholder')"
            required
            autocomplete="new-password"
          />

          <div v-if="error" class="alert alert-error mt-4 py-2 text-sm">
            <span>{{ error }}</span>
          </div>

          <button class="btn btn-primary mt-5 w-full" :disabled="loading">
            <span v-if="loading" class="loading loading-spinner loading-sm" />
            {{ loading ? t('auth.creatingAccount') : t('auth.createAccount') }}
          </button>
        </form>

        <p class="text-center text-sm text-base-content/50 mt-4">
          {{ t('auth.alreadyHaveAccount') }}
          <RouterLink to="/login" class="link link-primary font-medium">{{ t('auth.signIn') }}</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>