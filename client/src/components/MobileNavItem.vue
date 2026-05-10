<script setup lang="ts">
import type { MenuItem } from '@/stores/nav';
import { RouterLink } from 'vue-router'

const props = defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <li v-if="!item.children">
    <RouterLink v-if="item.to" :to="item.to">
      {{ item.label }}
    </RouterLink>
    <a v-else>{{ item.label }}</a>
  </li>
  <li v-else>
    <details>
      <summary>{{ item.label }}</summary>
      <ul>
        <MobileNavItem v-for="child in item.children" :item="child" />
      </ul>
    </details>
  </li>
</template>
