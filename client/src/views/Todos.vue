<script setup lang="ts">

import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { createClient } from 'graphql-ws'
import type { SelectTodoType } from '@starter/shared/schemas'
import { useApi } from '@/lib/api'
import { useTokensStore } from '@/stores/tokens'

const tokensStore = useTokensStore()

const client = createClient({
  url: '/api/graphql',
  connectionParams: () => {
    return {
      Authorization: `Bearer ${tokensStore.accessToken}`,
    };
  }
})

const { t } = useI18n()

const todos = ref<SelectTodoType[]>([])
const newTodo = ref('')

onMounted(async () => {
  const { isFetching, error, data } = await useApi('/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
        todos(orderBy: {text: {priority: 1, direction: asc}}) {
          uuid
          text
        }
      }`,
    }),
  })
  const result = JSON.parse(data.value as string) as any
  todos.value = result.data.todos

  const subscription = client.iterate({
    query: `subscription {
      todoAdded {
        uuid
        text
      }
    }`,
  })

  for await (const event of subscription) {
    console.log(event)
  }
})

async function handleAdd() {
  const { isFetching, error, data } = await useApi('/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `mutation AddTodo($values: TodosInsertInput!) {
        insertTodo(values: $values) {
          uuid
          text
        }
      }`,
      variables: {
        values: {
          text: newTodo.value,
        },
      },
    }),
  })

  const result = JSON.parse(data.value as string) as any
}
</script>

<template>
  <main class="h-full">
    <h1>{{ t('message.hello') }}</h1>

    <form @submit.prevent="handleAdd">
      <input class="input" v-model="newTodo" type="text" />
      <input class="btn" type="submit" value="Add" />
    </form>

    <div v-for="todo in todos">
      {{ todo.text }}
    </div>
  </main>
</template>
