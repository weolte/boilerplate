<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useApi } from '@/lib/api'

const { t } = useI18n()

const { data, isFetching } = useApi('/graphql').post({
  query: `{
    todos(orderBy: {text: {priority: 1, direction: asc}}) {
      uuid
      text
    }
  }`,
}).json()
</script>

<template>
  <main class="h-full">
    <h1>{{ t('message.hello') }}</h1>

    <template v-if="isFetching">
      <div class="card w-96 bg-base-100 card-xs shadow-sm">
        <div class="skeleton h-4 w-32"></div>
      </div>
    </template>
    <template v-else>
      <div class="card w-96 bg-base-100 card-xs shadow-sm" v-for="todo in data?.data?.todos">
        {{ todo.text }}
        asdf
      </div>
    </template>
  </main>
</template>
