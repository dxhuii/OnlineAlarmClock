<script setup lang="ts">
import { Howl } from 'howler'

const { t } = useI18n()

useHead({
  title: t('timer_title'),
  meta: [
    { name: 'description', content: t('timer_description') },
    { property: 'og:title', content: t('timer_title') },
    { property: 'og:description', content: t('timer_description') },
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

const selectedHour = ref<string>('00')
const selectedMinute = ref<string>('00')
const selectedSecond = ref<string>('00')
const timeLeft = ref<number>(0)
const isRunning = ref(false)
const isPaused = ref(false)
const soundFile = ref<string>('/sounds/bells.mp3') // 默认第一个声音
const showTimerPopup = ref(false) // 控制弹窗显示
let timer: NodeJS.Timeout | null = null

const alarmSound = computed(() => new Howl({
  src: [soundFile.value],
  loop: true,
}))

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))
const seconds = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

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

// 快捷时间
const quickTimes = [
  { label: '15s', value: 15 },
  { label: '20s', value: 20 },
  { label: '30s', value: 30 },
  { label: '45s', value: 45 },
  { label: '1m', value: 60 },
  { label: '5m', value: 300 },
  { label: '10m', value: 600 },
  { label: '15m', value: 900 },
  { label: '20m', value: 1200 },
  { label: '25m', value: 1500 },
  { label: '30m', value: 1800 },
  { label: '45m', value: 2700 },
]

// 格式化时间显示
const formattedTimeLeft = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600)
  const minutes = Math.floor((timeLeft.value % 3600) / 60)
  const seconds = timeLeft.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 开始计时器
function startTimer() {
  if (isRunning.value && isPaused.value) {
    resumeTimer()
    return
  }

  const hours = Number.parseInt(selectedHour.value, 10) || 0
  const minutes = Number.parseInt(selectedMinute.value, 10) || 0
  const seconds = Number.parseInt(selectedSecond.value, 10) || 0
  timeLeft.value = hours * 3600 + minutes * 60 + seconds

  if (timeLeft.value <= 0)
    return

  isRunning.value = true
  isPaused.value = false

  if (timer)
    clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    }
    else {
      stopTimer()
      alarmSound.value.play()
      showTimerPopup.value = true
    }
  }, 1000)
}

// 暂停计时器
function pauseTimer() {
  if (timer)
    clearInterval(timer)
  isPaused.value = true
}

// 继续计时器
function resumeTimer() {
  if (timeLeft.value <= 0)
    return

  isPaused.value = false
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    }
    else {
      stopTimer()
      alarmSound.value.play()
      showTimerPopup.value = true
    }
  }, 1000)
}

// 切换暂停/继续
function togglePauseResume() {
  if (isPaused.value) {
    resumeTimer()
  }
  else {
    pauseTimer()
  }
}

// 重置计时器（重置后立即开始）
function resetTimer() {
  if (timer)
    clearInterval(timer)
  isRunning.value = false
  isPaused.value = false
  const hours = Number.parseInt(selectedHour.value, 10) || 0
  const minutes = Number.parseInt(selectedMinute.value, 10) || 0
  const seconds = Number.parseInt(selectedSecond.value, 10) || 0
  timeLeft.value = hours * 3600 + minutes * 60 + seconds
  startTimer() // 重置后立即开始
}

// 设置快捷时间并立即开始
function setQuickTimeAndStart(time: { label: string, value: number }) {
  const totalSeconds = time.value
  selectedHour.value = String(Math.floor(totalSeconds / 3600)).padStart(2, '0')
  selectedMinute.value = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0')
  selectedSecond.value = String(totalSeconds % 60).padStart(2, '0')
  startTimer()
}

// 停止计时器（隐藏倒计时）
function stopTimer() {
  if (timer)
    clearInterval(timer)
  isRunning.value = false
  isPaused.value = false
  timeLeft.value = 0
  alarmSound.value.stop()
}

// 隐藏计时器结束弹窗并停止声音
function hideTimerPopup() {
  showTimerPopup.value = false
  alarmSound.value.stop()
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('online_timer') }}
    </h1>

    <!-- 时间输入 -->
    <div class="mb-6 w-80 flex gap-2">
      <div class="relative flex-1">
        <select
          v-model="selectedHour"
          class="w-full cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {{ $t('hour') }}
          </option>
          <option v-for="h in hours" :key="h" :value="h">
            {{ h }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-3 top-1/2 transform text-gray-400 -translate-y-1/2 dark:text-gray-500">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      <div class="relative flex-1">
        <select
          v-model="selectedMinute"
          class="w-full cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {{ $t('minute') }}
          </option>
          <option v-for="m in minutes" :key="m" :value="m">
            {{ m }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-3 top-1/2 transform text-gray-400 -translate-y-1/2 dark:text-gray-500">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
      <div class="relative flex-1">
        <select
          v-model="selectedSecond"
          class="w-full cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="" disabled>
            {{ $t('second') }}
          </option>
          <option v-for="s in seconds" :key="s" :value="s">
            {{ s }}
          </option>
        </select>
        <span class="pointer-events-none absolute right-3 top-1/2 transform text-gray-400 -translate-y-1/2 dark:text-gray-500">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </div>
    </div>

    <!-- 快捷时间按钮 -->
    <div class="mb-6 w-80 flex flex-wrap justify-center gap-2">
      <button
        v-for="time in quickTimes"
        :key="time.value"
        class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600"
        @click="setQuickTimeAndStart(time)"
      >
        {{ time.label }}
      </button>
    </div>

    <!-- 计时器显示 -->
    <div v-if="isRunning" class="mb-6 text-center">
      <div class="breathe-animation relative h-72 w-72 flex flex-col items-center justify-center rounded-full bg-white shadow-xl dark:bg-gray-800">
        <div class="absolute left-4 top-4">
          <div class="i-mdi-timer text-2xl text-gray-800 dark:text-white" />
        </div>
        <div class="text-3xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
          {{ formattedTimeLeft }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="mb-6 flex gap-4">
      <button
        :disabled="isRunning && !isPaused"
        class="rounded-full bg-blue-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 dark:hover:bg-blue-600"
        @click="startTimer"
      >
        {{ $t('start') }}
      </button>
      <button
        :disabled="!isRunning"
        class="rounded-full bg-yellow-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-yellow-500 disabled:bg-gray-400 hover:bg-yellow-700 dark:hover:bg-yellow-600"
        @click="togglePauseResume"
      >
        {{ isPaused ? $t('resume') : $t('pause') }}
      </button>
      <button
        :disabled="!isRunning && !timeLeft"
        class="rounded-full bg-red-600 px-6 py-3 text-lg text-white transition-colors dark:bg-red-500 hover:bg-red-700 dark:hover:bg-red-600"
        @click="resetTimer"
      >
        {{ $t('reset') }}
      </button>
      <button
        :disabled="!isRunning"
        class="rounded-full bg-gray-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-gray-500 disabled:bg-gray-400 hover:bg-gray-700 dark:hover:bg-gray-600"
        @click="stopTimer"
      >
        {{ $t('stop') }}
      </button>
    </div>

    <!-- 声音选择 -->
    <SoundSelector v-model:selected-sound="soundFile" />

    <!-- 计时器结束弹窗 -->
    <div v-if="showTimerPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="hideTimerPopup">
      <div class="relative max-w-md w-full rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
          {{ $t('timer_finished') }}
        </h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          {{ $t('timer_message') }}
        </p>
        <button class="absolute right-4 top-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" @click="hideTimerPopup">
          <div class="i-mdi-close h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 呼吸灯动画 */
.breathe-animation {
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(37, 99, 235, 0.3),
      0 0 20px rgba(37, 99, 235, 0.2);
  }
  50% {
    box-shadow:
      0 0 20px rgba(37, 99, 235, 0.6),
      0 0 30px rgba(37, 99, 235, 0.4);
  }
}

/* 暗黑模式下的呼吸灯动画 */
@media (prefers-color-scheme: dark) {
  .breathe-animation {
    animation: breathe-dark 3s ease-in-out infinite;
  }

  @keyframes breathe-dark {
    0%,
    100% {
      box-shadow:
        0 0 10px rgba(37, 99, 235, 0.3),
        0 0 20px rgba(37, 99, 235, 0.2);
    }
    50% {
      box-shadow:
        0 0 20px rgba(37, 99, 235, 0.6),
        0 0 30px rgba(37, 99, 235, 0.4);
    }
  }
}

/* 弹窗淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
