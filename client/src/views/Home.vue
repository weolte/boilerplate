<script setup lang="ts">
import MainLayout from '@/layouts/Main.vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t } = useI18n()

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const chartData = ref({
  labels: ['January', 'February', 'March'],
  datasets: [
    {
      label: 'Data',
      data: [40, 20, 12],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b'],
    },
  ],
})

const chartOptions = ref({
  responsive: true,
})
</script>

<template>
  <main class="h-full">
    <h1>{{ t('message.hello') }}</h1>

    <button class="btn">PING</button>

    <div class="w-150">
      <Bar :options="chartOptions" :data="chartData" />
    </div>
  </main>
</template>
