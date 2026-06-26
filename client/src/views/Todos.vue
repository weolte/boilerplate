<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useApi } from '@/lib/api'
import type { SelectTodoType } from '@starter/shared/schemas'

const { t } = useI18n()

const { data: result, isFetching, error } = useApi('/graphql').post({
  query: `{
    todos(orderBy: {text: {priority: 1, direction: asc}}) {
      uuid
      text
    }
  }`,
}).json<{ data: { todos: SelectTodoType[] } }>()
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">Todos</h1>
      <p class="text-base-content/60 mt-1">Manage your tasks</p>
    </div>

    <div v-if="isFetching" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div v-for="n in 6" :key="n" class="card bg-base-100/80 border border-base-300/30 shadow-sm">
        <div class="card-body p-4">
          <div class="skeleton h-4 w-3/4"></div>
          <div class="skeleton h-3 w-1/2 mt-2"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="alert alert-error shadow-lg">
      <span>{{ t('message.error') }}</span>
    </div>

    <div v-else-if="!result?.data?.todos?.length" class="card bg-base-100/50 border border-dashed border-base-300/50">
      <div class="card-body text-center py-12">
        <p class="text-base-content/40">No todos yet</p>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div
        v-for="todo in result.data.todos"
        :key="todo.uuid"
        class="card bg-base-100/80 border border-base-300/30 shadow-sm hover:shadow-md hover:border-base-300/60 transition-all duration-200"
      >
        <div class="card-body p-4">
          <p class="font-medium">{{ todo.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>