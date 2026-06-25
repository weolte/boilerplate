<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { MenuItem } from '@/stores/nav';
import { useI18n } from 'vue-i18n'
import { nextTick, ref } from 'vue';

const { t } = useI18n()

const openLeft = ref(false)

const props = defineProps<{
  item: MenuItem
  level?: number
}>()

const handleEnter = async (e: any) => {
  await nextTick()

  await new Promise(r => setTimeout(r, 30))

  const rect = e.target.getBoundingClientRect()
  const spaceRight = window.innerWidth - rect.right

  openLeft.value = spaceRight < 220
}
</script>

<template>
  <li v-if="!item.children">
    <RouterLink v-if="item.to" :to="item.to">
      {{ t(item.key) }}
    </RouterLink>
    <a v-else>{{ t(item.key) }}</a>
  </li>

  <li v-else class="dropdown" @mouseenter="handleEnter" :class="[
    level === 0 ? 'dropdown-bottom' : '',
    level && level > 0
      ? (openLeft ? 'dropdown-left' : 'dropdown-right')
      : ''
  ]">
    <div tabindex="0" role="button">{{ t(item.key) }}</div>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm m-0">
      <DesktopNavItem v-for="child in item.children" :item="child" :level="(level ?? 0) + 1" />
    </ul>
  </li>
</template>
