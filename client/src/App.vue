<script setup lang="ts">
import { onMounted } from 'vue'
import Toast from './components/Toast.vue'

onMounted(async () => {
  const res = await fetch('/api/graphql', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query: '{ health }',
    }),
  })

  console.log(await res.json())
})
</script>

<template>
  <RouterView />
  <Toast />
</template>
