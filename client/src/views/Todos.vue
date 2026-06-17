<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useApi } from '@/lib/api'

const { t } = useI18n()

const { data: result, isFetching } = useApi('/graphql').post({
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

    <div class="grid grid-cols-3 gap-2 px-2">

      <template v-if="isFetching">
        <div class="card bg-base-100 card-xs shadow-sm px-4 py-2" v-for="n in 5" :key="n">
          <div class="skeleton h-4 w-32"></div>
          <div class="skeleton h-4 w-32 mt-2"></div>
        </div>
      </template>
      <template v-else>
        <div class="card bg-base-100 card-xs shadow-sm px-4 py-2" v-for="todo in result?.data?.todos" :key="todo.uuid">
          <div>{{ todo.text }}</div>
          <div>
            asdf
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
