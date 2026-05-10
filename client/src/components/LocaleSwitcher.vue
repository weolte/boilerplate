<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { locale, availableLocales } = useI18n()
</script>

<template>
  <select
    id="locale-switcher"
    class="select appearance-none bg-none w-10 p-0 text-center"
    v-model="locale"
  >
    <option v-for="locale in availableLocales" :key="`locale-${locale}`" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>
