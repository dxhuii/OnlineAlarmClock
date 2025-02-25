<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('stopwatch_title'),
  meta: [
    { name: 'description', content: t('stopwatch_description') },
    { property: 'og:title', content: t('stopwatch_title') },
    { property: 'og:description', content: t('stopwatch_description') },
    { property: 'og:image', content: 'https://onlinealarmclock.cms.im/logo.png' },
    { property: 'og:image:width', content: '968' },
    { property: 'og:image:height', content: '504' },
    { property: 'og:url', content: 'https://onlinealarmclock.cms.im/' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'cms.com' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@dxhuii' },
  ],
})

const elapsedTime = ref(0) // 经过时间（毫秒）
const isRunning = ref(false) // 秒表是否运行
const isPaused = ref(false) // 秒表是否暂停
let timer: NodeJS.Timeout | null = null

// 当前时间和日期（国际化，每秒更新）
const { locale } = useI18n()
const currentTime = ref('')
const currentDate = ref('')
const currentWeekday = ref('')
const amPm = ref('') // AM/PM
function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString(locale.value, {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  }).replace(/AM|PM/i, '').trim()
  amPm.value = now.getHours() >= 12 ? 'PM' : 'AM'
  currentDate.value = now.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
  currentWeekday.value = now.toLocaleDateString(locale.value, { weekday: 'long' })
}

onMounted(() => {
  updateTime()
  const intervalId = setInterval(updateTime, 1000)
  onUnmounted(() => clearInterval(intervalId))
})

// 格式化秒表时间
const formattedTime = computed(() => {
  const hours = Math.floor(elapsedTime.value / 3600000)
  const minutes = Math.floor((elapsedTime.value % 3600000) / 60000)
  const seconds = Math.floor((elapsedTime.value % 60000) / 1000)
  const milliseconds = Math.floor(elapsedTime.value % 1000 / 10)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${milliseconds.toString().padStart(2, '0')}`
})

// 开始秒表
function startStopwatch() {
  if (isRunning.value)
    return
  isRunning.value = true
  isPaused.value = false
  const startTime = Date.now() - (isPaused.value ? elapsedTime.value : 0)
  timer = setInterval(() => {
    elapsedTime.value = Date.now() - startTime
  }, 10)
}

// 暂停秒表
function pauseStopwatch() {
  if (!isRunning.value || isPaused.value)
    return
  clearInterval(timer!)
  isPaused.value = true
}

// 继续秒表
function resumeStopwatch() {
  if (!isRunning.value || !isPaused.value)
    return
  isPaused.value = false
  const startTime = Date.now() - elapsedTime.value
  timer = setInterval(() => {
    elapsedTime.value = Date.now() - startTime
  }, 10)
}

// 重置秒表
function resetStopwatch() {
  clearInterval(timer!)
  isRunning.value = false
  isPaused.value = false
  elapsedTime.value = 0
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('online_stopwatch') }}
    </h1>

    <!-- 当前时间和日期 -->
    <div class="mb-6 text-center">
      <div class="text-3xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
        {{ currentTime }} {{ locale === 'en' ? amPm : '' }}
      </div>
      <div class="text-xl text-gray-600 dark:text-gray-300" style="font-family: 'clockicons', sans-serif;">
        {{ currentDate }} {{ currentWeekday }}
      </div>
    </div>

    <!-- 秒表显示 -->
    <div class="mb-6 text-center">
      <div class="relative h-72 w-72 flex flex-col items-center justify-center rounded-full bg-white shadow-xl dark:bg-gray-800">
        <div class="absolute left-4 top-4">
          <div class="i-mdi-stopwatch text-2xl text-gray-800 dark:text-white" />
        </div>
        <div class="text-3xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
          {{ formattedTime }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-6 flex gap-4">
      <button
        :disabled="isRunning"
        class="rounded-full bg-blue-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 dark:hover:bg-blue-600"
        @click="startStopwatch"
      >
        {{ $t('start') }}
      </button>
      <button
        :disabled="!isRunning || isPaused"
        class="rounded-full bg-yellow-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-yellow-500 disabled:bg-gray-400 hover:bg-yellow-700 dark:hover:bg-yellow-600"
        @click="pauseStopwatch"
      >
        {{ $t('pause') }}
      </button>
      <button
        :disabled="!isRunning || !isPaused"
        class="rounded-full bg-green-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-green-500 disabled:bg-gray-400 hover:bg-green-700 dark:hover:bg-green-600"
        @click="resumeStopwatch"
      >
        {{ $t('resume') }}
      </button>
      <button
        class="rounded-full bg-red-600 px-6 py-3 text-lg text-white transition-colors dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600"
        @click="resetStopwatch"
      >
        {{ $t('reset') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 无需额外样式，保持一致 */
</style>
