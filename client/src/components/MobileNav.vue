<script setup lang="ts">
import { useNavStore } from '@/stores/nav';
import MobileNavItem from './MobileNavItem.vue';
const nav = useNavStore()
</script>

<template>
  <ul class="menu bg-base-200 min-h-full w-80 p-4">
    <MobileNavItem v-for="navItem in nav.items" :item="navItem" />
  </ul>
</template>
