<script setup lang="ts">
import MainLayout from '@/layouts/Main.vue'

import { useI18n } from 'vue-i18n'
import { onMounted, ref } from 'vue'
import { createClient } from 'graphql-ws'
import type { SelectTodoType } from '@starter/shared/schemas'

const client = createClient({
  url: '/api/graphql',
})

const { t } = useI18n()

const todos = ref<SelectTodoType[]>([])
const newTodo = ref('')

onMounted(async () => {
  const response = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: `query GetTodos {
        todos(orderBy: {text: {priority: 1, direction: asc}}) {
          uuid
          text
        }
      }`,
    }),
  })

  const result = await response.json()
  todos.value = result.data.todos

  const subscription = client.iterate({
    query: `subscription SubscribeTodo {
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
  const response = await fetch('/api/graphql', {
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

  const result = await response.json()
}
</script>

<template>
  <MainLayout>
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
  </MainLayout>
</template>
