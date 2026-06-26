<script setup lang="ts">
import type { MenuItem } from '@/stores/nav';
import { useI18n } from 'vue-i18n'
import { RouterLink, useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const props = defineProps<{
  item: MenuItem
}>()

const emit = defineEmits<{
  close: []
}>()

const isActive = () => props.item.to ? route.path === props.item.to : false
</script>

<template>
  <li v-if="!item.children">
    <RouterLink v-if="item.to" :to="item.to" :class="{ active: isActive() }" @click="emit('close')">
      {{ t(item.key) }}
    </RouterLink>
    <a v-else>{{ t(item.key) }}</a>
  </li>
  <li v-else>
    <details>
      <summary>{{ t(item.key) }}</summary>
      <ul>
        <MobileNavItem v-for="child in item.children" :item="child" @close="emit('close')" />
      </ul>
    </details>
  </li>
</template>