<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTokensStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface User {
  uuid: string
  username: string
  email: string
  verified: boolean
  createdAt: string
}

const users = ref<User[]>([])
const loading = ref(true)
const error = ref('')
const selected = ref<User | null>(null)
const showForm = ref(false)
const editing = ref(false)
const formData = ref({ username: '', email: '', password: '' })
const saving = ref(false)

const tokensStore = useTokensStore()

const headers = { Authorization: `Bearer ${tokensStore.accessToken}` }

async function fetchUsers() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/users', { headers })
    if (!res.ok) throw new Error()
    users.value = await res.json()
  } catch {
    error.value = t('users.error')
  } finally {
    loading.value = false
  }
}

async function saveUser() {
  saving.value = true
  try {
    const url = editing.value && selected.value
      ? `/api/users/${selected.value.uuid}`
      : '/api/users'
    const method = editing.value ? 'PUT' : 'POST'
    const body = editing.value
      ? { username: formData.value.username, email: formData.value.email }
      : formData.value

    const res = await fetch(url, {
      method,
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    if (!res.ok) throw new Error()
    showForm.value = false
    await fetchUsers()
  } catch {
    // handle error
  } finally {
    saving.value = false
  }
}

async function deleteUser(user: User) {
  if (!confirm(t('users.deleteConfirm'))) return
  try {
    await fetch(`/api/users/${user.uuid}`, { method: 'DELETE', headers })
    await fetchUsers()
  } catch {
    // handle error
  }
}

function openCreate() {
  editing.value = false
  selected.value = null
  formData.value = { username: '', email: '', password: '' }
  showForm.value = true
}

function openEdit(user: User) {
  editing.value = true
  selected.value = user
  formData.value = { username: user.username, email: user.email, password: '' }
  showForm.value = true
}

onMounted(fetchUsers)
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">{{ t('users.title') }}</h1>
        <p class="text-base-content/60 mt-1">{{ t('users.description') }}</p>
      </div>
      <button class="btn btn-primary" @click="openCreate">{{ t('users.create') }}</button>
    </div>

    <div v-if="loading" class="space-y-2">
      <div v-for="n in 5" :key="n" class="skeleton h-12 w-full"></div>
    </div>

    <div v-else-if="error" class="alert alert-error shadow-lg">
      <span>{{ error }}</span>
    </div>

    <div v-else-if="users.length === 0" class="card bg-base-100/50 border border-dashed border-base-300/50">
      <div class="card-body text-center py-12">
        <p class="text-base-content/40">{{ t('users.empty') }}</p>
      </div>
    </div>

    <div v-else class="card bg-base-100/80 border border-base-300/30 shadow-sm overflow-x-auto">
      <table class="table">
        <thead>
          <tr>
            <th>{{ t('users.username') }}</th>
            <th>{{ t('users.email') }}</th>
            <th>{{ t('users.verified') }}</th>
            <th>{{ t('users.created') }}</th>
            <th class="w-24">{{ t('users.actions') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uuid" class="hover:bg-base-200/50 transition-colors">
            <td class="font-medium">{{ user.username }}</td>
            <td class="text-base-content/70">{{ user.email }}</td>
            <td>
              <div v-if="user.verified" class="badge badge-success badge-sm">Yes</div>
              <div v-else class="badge badge-ghost badge-sm">No</div>
            </td>
            <td class="text-sm text-base-content/60">{{ new Date(user.createdAt).toLocaleDateString() }}</td>
            <td>
              <div class="flex gap-1">
                <button class="btn btn-ghost btn-sm btn-square" @click="openEdit(user)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                  </svg>
                </button>
                <button class="btn btn-ghost btn-sm btn-square text-error" @click="deleteUser(user)">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
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
        <h3 class="text-lg font-bold mb-4">{{ editing ? t('users.edit') : t('users.create') }}</h3>
        <form @submit.prevent="saveUser" class="fieldset gap-1">
          <label class="fieldset-label text-xs font-medium">{{ t('users.username') }}</label>
          <input v-model="formData.username" type="text" class="input w-full" required />

          <label class="fieldset-label text-xs font-medium mt-3">{{ t('users.email') }}</label>
          <input v-model="formData.email" type="email" class="input w-full" required />

          <label v-if="!editing" class="fieldset-label text-xs font-medium mt-3">Password</label>
          <input v-if="!editing" v-model="formData.password" type="password" class="input w-full" required />

          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="showForm = false">{{ t('users.cancel') }}</button>
            <button class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="loading loading-spinner loading-sm" />
              {{ t('users.save') }}
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