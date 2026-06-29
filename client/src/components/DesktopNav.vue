<script setup lang="ts">
import { useNavStore } from '@/stores/nav';
import DesktopNavItem from './DesktopNavItem.vue';

const nav = useNavStore()
</script>

<template>
  <ul class="menu menu-horizontal p-0">
    <DesktopNavItem v-for="navItem in nav.visibleItems" :item="navItem" />
  </ul>
</template>
