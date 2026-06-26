<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useTokensStore } from '@/stores/tokens'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tokensStore = useTokensStore()

const headers = { Authorization: `Bearer ${tokensStore.accessToken}` }

const roles = ref<string[]>([])
const loading = ref(true)
const error = ref('')
const selectedRole = ref<string | null>(null)
const members = ref<string[]>([])
const membersLoading = ref(false)

const attachUuid = ref('')
const showAttach = ref(false)

async function fetchRoles() {
  loading.value = true
  error.value = ''
  try {
    const res = await fetch('/api/casbin/all-roles', { headers })
    if (!res.ok) throw new Error()
    roles.value = await res.json()
  } catch {
    error.value = t('groups.error')
  } finally {
    loading.value = false
  }
}

async function selectRole(role: string) {
  selectedRole.value = role
  membersLoading.value = true
  try {
    const res = await fetch(`/api/casbin/role-users/${encodeURIComponent(role)}`, { headers })
    if (!res.ok) throw new Error()
    members.value = await res.json()
  } catch {
    members.value = []
  } finally {
    membersLoading.value = false
  }
}

async function unattach(user: string) {
  try {
    await fetch('/api/casbin/unattach-role', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, role: selectedRole.value }),
    })
    if (selectedRole.value) await selectRole(selectedRole.value)
  } catch {
    // handle error
  }
}

async function attachUser() {
  if (!attachUuid.value || !selectedRole.value) return
  try {
    await fetch('/api/casbin/attach-role', {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ user: attachUuid.value, role: selectedRole.value }),
    })
    attachUuid.value = ''
    showAttach.value = false
    if (selectedRole.value) await selectRole(selectedRole.value)
  } catch {
    // handle error
  }
}

onMounted(fetchRoles)
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ t('groups.title') }}</h1>
      <p class="text-base-content/60 mt-1">{{ t('groups.description') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="card bg-base-100/80 border border-base-300/30 shadow-sm">
        <div class="card-body p-0">
          <div class="px-5 py-3 border-b border-base-300/20 font-semibold">{{ t('access.title') }}</div>
          <div v-if="loading" class="p-4 space-y-2">
            <div v-for="n in 3" :key="n" class="skeleton h-10 w-full"></div>
          </div>
          <div v-else-if="error" class="p-4 text-sm text-error">{{ error }}</div>
          <div v-else-if="roles.length === 0" class="p-4 text-sm text-base-content/40 text-center py-8">{{ t('groups.empty') }}</div>
          <div v-else class="divide-y divide-base-300/20">
            <button
              v-for="role in roles"
              :key="role"
              class="w-full text-left px-5 py-3 flex items-center gap-3 hover:bg-base-200/50 transition-colors duration-150"
              :class="{ 'bg-primary/10': selectedRole === role }"
              @click="selectRole(role)"
            >
              <div class="size-2 rounded-full bg-primary shrink-0" />
              <span class="font-medium">{{ role }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="card bg-base-100/80 border border-base-300/30 shadow-sm">
        <div class="card-body p-0">
          <div class="px-5 py-3 border-b border-base-300/20 flex items-center justify-between">
            <span class="font-semibold">{{ t('groups.members') }}{{ selectedRole ? ` — ${selectedRole}` : '' }}</span>
            <button v-if="selectedRole" class="btn btn-primary btn-xs" @click="showAttach = true">{{ t('groups.attachUser') }}</button>
          </div>
          <div v-if="!selectedRole" class="p-4 text-sm text-base-content/40 text-center py-8">Select a role to view members</div>
          <div v-else-if="membersLoading" class="p-4 space-y-2">
            <div v-for="n in 3" :key="n" class="skeleton h-10 w-full"></div>
          </div>
          <div v-else-if="members.length === 0" class="p-4 text-sm text-base-content/40 text-center py-8">{{ t('groups.noMembers') }}</div>
          <div v-else class="divide-y divide-base-300/20">
            <div v-for="user in members" :key="user"
              class="flex items-center justify-between px-5 py-3 hover:bg-base-200/50 transition-colors duration-150">
              <span class="font-mono text-sm">{{ user }}</span>
              <button class="btn btn-ghost btn-xs text-error" @click="unattach(user)">{{ t('groups.unattach') }}</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <dialog :open="showAttach" class="modal backdrop-blur-sm">
      <div class="modal-box bg-base-100/95 backdrop-blur-lg border border-base-300/30">
        <form method="dialog">
          <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" @click="showAttach = false">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
        <h3 class="text-lg font-bold mb-4">{{ t('groups.attachUser') }}</h3>
        <form @submit.prevent="attachUser" class="fieldset gap-1">
          <label class="fieldset-label text-xs font-medium">UUID</label>
          <input v-model="attachUuid" type="text" class="input w-full" :placeholder="t('groups.userPlaceholder')" required />
          <div class="modal-action">
            <button type="button" class="btn btn-ghost" @click="showAttach = false">{{ t('policies.cancel') }}</button>
            <button class="btn btn-primary">{{ t('groups.attachUser') }}</button>
          </div>
        </form>
      </div>
      <form method="dialog" class="modal-backdrop" @click="showAttach = false">
        <button>close</button>
      </form>
    </dialog>
  </div>
</template>