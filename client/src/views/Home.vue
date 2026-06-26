<script setup lang="ts">
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
      borderRadius: 6,
    },
  ],
})

const chartOptions = ref({
  responsive: true,
  plugins: {
    legend: {
      display: false,
    },
  },
})
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-3xl font-bold tracking-tight">{{ t('message.hello') }}</h1>
      <p class="text-base-content/60 mt-1">Welcome back to your dashboard</p>
    </div>

    <div class="stats shadow-sm border border-base-300/50 w-full bg-base-100/80 backdrop-blur-sm">
      <div class="stat">
        <div class="stat-title">Total Users</div>
        <div class="stat-value text-primary">1,024</div>
        <div class="stat-desc">Active accounts</div>
      </div>
      <div class="stat">
        <div class="stat-title">Devices</div>
        <div class="stat-value text-secondary">12</div>
        <div class="stat-desc">Connected devices</div>
      </div>
      <div class="stat">
        <div class="stat-title">Tasks</div>
        <div class="stat-value text-accent">48</div>
        <div class="stat-desc">Items in progress</div>
      </div>
    </div>

    <div class="card bg-base-100/80 backdrop-blur-sm border border-base-300/30 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-lg font-semibold">Analytics</h2>
        <div class="w-full max-w-lg mt-2">
          <Bar :options="chartOptions" :data="chartData" />
        </div>
      </div>
    </div>
  </div>
</template>