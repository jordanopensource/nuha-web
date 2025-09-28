import { Chart, BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ArcElement } from 'chart.js'

export default defineNuxtPlugin(() => {
  // Register once on client to avoid SSR issues
  Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, Title, ArcElement)
})