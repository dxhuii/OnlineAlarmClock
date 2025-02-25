<script setup lang="ts">
import { Howl } from 'howler'

const { t } = useI18n()

useHead({
  title: t('title'),
  meta: [
    { name: 'description', content: t('description') },
    { name: 'keywords', content: t('keywords') },
    { name: 'robots', content: 'noindex,nofollow' },
    { property: 'og:title', content: t('title') },
    { property: 'og:description', content: t('description') },
    { property: 'og:image', content: 'https://onlinealarmclock.cms.im/nuxt.png' },
    { property: 'og:image:width', content: '968' },
    { property: 'og:image:height', content: '504' },
    { property: 'og:url', content: 'https://onlinealarmclock.cms.im/' },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'cms.com' },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:site', content: '@dxhuii' },
  ],
})

const selectedHour = ref<string>('')
const selectedMinute = ref<string>('')
const timeLeft = ref<number>(0)
const isRunning = ref(false)
const soundFile = ref<string>('/sounds/bells.mp3') // 默认第一个声音
const showAlarmPopup = ref(false) // 控制弹窗显示
let timer: NodeJS.Timeout | null = null

const alarmSound = computed(() => new Howl({
  src: [soundFile.value],
  loop: true,
}))

const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'))
const minutes = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'))

// 当前时间和日期（国际化，每秒更新）
const { locale } = useI18n()
const currentTime = ref('')
const currentDate = ref('')
const currentWeekday = ref('')
const amPm = ref('') // AM/PM
const alarmTime = computed(() =>
  selectedHour.value && selectedMinute.value
    ? `${selectedHour.value}:${selectedMinute.value}`
    : '',
)

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

// 初始调用和定时更新仅在客户端执行
onMounted(() => {
  updateTime() // 初次更新
  const intervalId = setInterval(updateTime, 1000) // 每秒更新
  onUnmounted(() => clearInterval(intervalId)) // 清理定时器
})

// 设置快捷时间并立即开始
function setQuickTimeAndStart(hour: string, minute: string) {
  selectedHour.value = hour
  selectedMinute.value = minute
  startAlarm()
}

// 格式化倒计时
const formattedTimeLeft = computed(() => {
  const hours = Math.floor(timeLeft.value / 3600)
  const minutes = Math.floor((timeLeft.value % 3600) / 60)
  const seconds = timeLeft.value % 60
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
})

// 开始闹钟
function startAlarm() {
  if (!alarmTime.value)
    return

  const [hours, minutes] = alarmTime.value.split(':').map(Number)
  if (Number.isNaN(hours) || Number.isNaN(minutes))
    return

  const now = new Date()
  const alarm = new Date()
  alarm.setHours(hours!, minutes, 0, 0)

  if (alarm <= now) {
    alarm.setDate(alarm.getDate() + 1)
  }

  const diff = Math.floor((alarm.getTime() - now.getTime()) / 1000)
  if (diff <= 0)
    return

  timeLeft.value = diff
  isRunning.value = true

  if (timer)
    clearInterval(timer)
  timer = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value -= 1
    }
    else {
      stopAlarm()
      alarmSound.value.play()
      showAlarmPopup.value = true // 显示弹窗
    }
  }, 1000)
}

// 停止闹钟
function stopAlarm() {
  if (timer)
    clearInterval(timer)
  isRunning.value = false
  alarmSound.value.stop()
}

// 切换闹钟状态（开始/停止）
function toggleAlarm() {
  if (isRunning.value) {
    stopAlarm()
  }
  else {
    startAlarm()
  }
}

// 隐藏弹窗并停止声音
function hideAlarmPopup() {
  showAlarmPopup.value = false
  alarmSound.value.stop() // 关闭弹窗时停止声音
}

// 切换语言
const { setLocale } = useI18n()
const switchLocale = (locale: string) => setLocale(locale as 'en' | 'zh')

// 清理
onUnmounted(() => {
  if (timer)
    clearInterval(timer)
  alarmSound.value.unload()
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-4 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('title') }}
    </h1>
    <div class="fixed right-5 top-5">
      <DarkToggle />
    </div>

    <!-- 当前时间和日期 -->
    <div class="mb-6 text-center">
      <div class="text-3xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
        {{ currentTime }} {{ locale === 'en' ? amPm : '' }}
      </div>
      <div class="text-xl text-gray-600 dark:text-gray-300" style="font-family: 'clockicons', sans-serif;">
        {{ currentDate }} {{ currentWeekday }}
      </div>
    </div>

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
    </div>

    <!-- 快捷时间 -->
    <QuickTimes @set-quick-time-and-start="setQuickTimeAndStart" />

    <!-- 声音选择 -->
    <SoundSelector v-model:selected-sound="soundFile" />

    <!-- 倒计时显示 -->
    <div v-if="isRunning" class="mb-6 text-center">
      <div class="breathe-animation relative h-72 w-72 flex flex-col items-center justify-center rounded-full bg-white shadow-xl dark:bg-gray-800">
        <div class="absolute left-4 top-4">
          <div class="i-mdi-alarm text-2xl text-gray-800 dark:text-white" />
        </div>
        <div class="mb-2 text-xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
          {{ alarmTime }} {{ locale === 'en' ? amPm : '' }}
        </div>
        <div class="absolute bottom-4 right-4">
          <div class="i-mdi-clock-outline text-2xl text-gray-800 dark:text-white" />
        </div>
        <div class="text-3xl text-gray-800 dark:text-white" style="font-family: 'clockicons', sans-serif;">
          {{ formattedTimeLeft }}
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <!-- 操作按钮 -->
    <div class="mb-6">
      <button
        :disabled="!alarmTime"
        class="rounded-full bg-blue-600 px-6 py-3 text-lg text-white transition-colors disabled:cursor-not-allowed dark:bg-blue-500 disabled:bg-gray-400 hover:bg-blue-700 dark:hover:bg-blue-600"
        @click="toggleAlarm"
      >
        {{ isRunning ? $t('stop') : $t('start') }}
      </button>
    </div>

    <!-- 如何使用在线闹钟文档 -->
    <div class="mb-6 max-w-2xl">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('how_to_use_title') }}
      </h2>
      <div class="prose dark:prose-invert">
        <p>{{ $t('how_to_use_intro') }}</p>
        <h3 class="mb-2 mt-4 text-xl font-semibold">
          {{ $t('setting_alarm') }}
        </h3>
        <p>{{ $t('setting_alarm_desc') }}</p>
        <h3 class="mb-2 mt-4 text-xl font-semibold">
          {{ $t('quick_times') }}
        </h3>
        <p>{{ $t('quick_times_desc') }}</p>
        <h3 class="mb-2 mt-4 text-xl font-semibold">
          {{ $t('sounds') }}
        </h3>
        <p>{{ $t('sounds_desc') }}</p>
        <h3 class="mb-2 mt-4 text-xl font-semibold">
          {{ $t('sharing') }}
        </h3>
        <p>{{ $t('sharing_desc') }}</p>
      </div>
    </div>

    <!-- 社交分享组件（仅客户端） -->
    <ClientOnly>
      <SocialShare />
    </ClientOnly>

    <!-- 语言切换 -->
    <div class="mt-6 flex gap-2">
      <button
        class="rounded px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="switchLocale('en')"
      >
        EN
      </button>
      <button
        class="rounded px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-gray-700"
        @click="switchLocale('zh')"
      >
        ZH
      </button>
    </div>

    <!-- 闹钟结束弹窗 -->
    <div v-if="showAlarmPopup" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" @click.self="hideAlarmPopup">
      <div class="relative max-w-md w-full rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
          {{ $t('alarm_finished') }}
        </h2>
        <p class="mb-6 text-gray-700 dark:text-gray-300">
          {{ $t('alarm_message') }}
        </p>
        <button class="absolute right-4 top-4 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" @click="hideAlarmPopup">
          <div class="i-mdi-close h-6 w-6" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 弹窗淡入动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 呼吸灯动画 */
.breathe-animation {
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%,
  100% {
    box-shadow:
      0 0 10px rgba(37, 99, 235, 0.3),
      0 0 20px rgba(37, 99, 235, 0.2); /* 蓝色光晕 */
  }
  50% {
    box-shadow:
      0 0 20px rgba(37, 99, 235, 0.6),
      0 0 30px rgba(37, 99, 235, 0.4); /* 增强光晕 */
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
        0 0 20px rgba(37, 99, 235, 0.2); /* 蓝色光晕 */
    }
    50% {
      box-shadow:
        0 0 20px rgba(37, 99, 235, 0.6),
        0 0 30px rgba(37, 99, 235, 0.4); /* 增强光晕 */
    }
  }
}
</style>
