<script setup lang="ts">
import type { MenuItem } from '@/stores/nav';
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()

const props = defineProps<{
  item: MenuItem
}>()
</script>

<template>
  <li v-if="!item.children">
    <RouterLink v-if="item.to" :to="item.to">
      {{ t(item.key) }}
    </RouterLink>
    <a v-else>{{ t(item.key) }}</a>
  </li>
  <li v-else>
    <details>
      <summary>{{ t(item.key) }}</summary>
      <ul>
        <MobileNavItem v-for="child in item.children" :item="child" />
      </ul>
    </details>
  </li>
</template>
