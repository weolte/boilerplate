<script setup lang="ts">
import MainLayout from '@/layouts/Main.vue'
import { onMounted, ref } from 'vue';

const roles = ref<any[]>([])

onMounted(async () => {
  const response = await fetch('/api/roles')
  const result = await response.json()

  roles.value = result
})
</script>

<template>
  <MainLayout>
    <div v-for="role in roles">
      {{ role.name }}
    </div>
  </MainLayout>
</template>