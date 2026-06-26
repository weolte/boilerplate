<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTokensStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tokensStore = useTokensStore()
const headers = { Authorization: `Bearer ${tokensStore.accessToken}` }

interface PolicyRule {
  sub: string
  obj: string
  act: string
}

const policies = ref<PolicyRule[]>([])
const loading = ref(true)
const error = ref('')
const showForm = ref(false)
const saving = ref(false)
const newPolicy = ref({ sub: '', obj: '', act: '' })

async function fetchPolicies() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/casbin/policies', { headers })
    if (!res.ok) throw new Error()
    const data = await res.json()
    policies.value = data.policies || []
  } catch {
    error.value = t('policies.error')
  } finally {
    loading.value = false
  }
}

async function createPolicy() {
  saving.value = true
  try {
    const res = await fetch('/api/casbin/policies', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(newPolicy.value),
    })
    if (!res.ok) throw new Error()
    showForm.value = false
    newPolicy.value = { sub: '', obj: '', act: '' }
    await fetchPolicies()
  } catch {
    // handle error
  } finally {
    saving.value = false
  }
}

async function deletePolicy(policy: PolicyRule) {
  if (!confirm(t('policies.deleteConfirm'))) return
  try {
    await fetch('/api/casbin/policies', {
      method: 'DELETE',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(policy),
    })
    await fetchPolicies()
  } catch {
    // handle error
  }
}

onMounted(fetchPolicies)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ t('policies.title') }}</h1>
        <p class="text-base-content/60 mt-1">{{ t('policies.description') }}</p>
      </div>
      <button class="btn btn-primary" @click="showForm = true">{{ t('policies.create') }}</button>
    </div>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 5" :key="n" class="skeleton h-12 w-full"></div>
    </div>

    <div v-else-if="error" class="alert alert-error shadow-lg">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="policies.length === 0" class="card bg-base-100/50 border border-dashed border-base-300/50">
      <div class="card-body text-center py-12">
        <p class="text-base-content/40">{{ t('policies.empty') }}</p>
      </div>
    </div>

    <div v-else class="card bg-base-100/80 border border-base-300/30 shadow-sm overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t('policies.subject') }}</th>
            <th>{{ t('policies.object') }}</th>
            <th>{{ t('policies.action') }}</th>
            <th class="w-16"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(policy, i) in policies" :key="i" class="hover:bg-base-200/50 transition-colors">
            <td class="font-mono text-sm">{{ policy.sub }}</td>
            <td class="font-mono text-sm">{{ policy.obj }}</td>
            <td><span class="badge badge-ghost badge-sm">{{ policy.act }}</span></td>
            <td>
              <button class="btn btn-ghost btn-sm btn-square text-error" @click="deletePolicy(policy)">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <dialog :open="showForm" class="modal backdrop-blur-sm">
      <div class="modal-box bg-base-100/95 backdrop-blur-lg border border-base-300/30">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="showForm = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
        <h3 class="text-lg font-bold mb-4">{{ t('policies.create') }}</h3>
        <form @submit.prevent="createPolicy" class="fieldset gap-1">
          <label class="fieldset-label text-xs font-medium">{{ t('policies.subject') }}</label>
          <input v-model="newPolicy.sub" type="text" class="input w-full" required />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('policies.object') }}</label>
          <input v-model="newPolicy.obj" type="text" class="input w-full" required />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('policies.action') }}</label>
          <input v-model="newPolicy.act" type="text" class="input w-full" required />

          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="showForm = false">{{ t('policies.cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="loading loading-spinner loading-sm" />
              {{ t('policies.add') }}
            </button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showForm = false">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>