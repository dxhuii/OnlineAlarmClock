<script setup lang="ts">
const { t } = useI18n()

useHead({
  title: t('world_time_title'),
  meta: [
    { name: 'description', content: t('world_time_description') },
    { property: 'og:title', content: t('world_time_title') },
    { property: 'og:description', content: t('world_time_description') },
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

const selectedTimezone = ref('')
const defaultCities = ref([
  { name: 'New York', timezone: 'America/New_York', offset: -5 },
  { name: 'London', timezone: 'Europe/London', offset: 0 },
  { name: 'Tokyo', timezone: 'Asia/Tokyo', offset: 9 },
  { name: 'Beijing', timezone: 'Asia/Shanghai', offset: 8 },
  { name: 'Sydney', timezone: 'Australia/Sydney', offset: 11 },
])

// 所有可用时区（示例，实际可扩展）
const availableTimezones = [
  'America/Los_Angeles',
  'America/Chicago',
  'America/Denver',
  'Europe/Paris',
  'Europe/Berlin',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Australia/Melbourne',
  // ... 可添加更多时区
]

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

// 获取城市时间
function cityTime(timezone: string) {
  const options = { timeZone: timezone, hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true } as any
  const time = new Date().toLocaleTimeString(locale.value as string, options).replace(/AM|PM/i, '').trim()
  return time
}

// 添加城市
function addCity() {
  if (selectedTimezone.value && !defaultCities.value.some(c => c.timezone === selectedTimezone.value)) {
    const timezone = selectedTimezone.value
    const name = timezone.split('/')[1]?.replace(/_/g, ' ') || ''
    const offset = new Date().toLocaleString('en-US', { timeZone: timezone, timeZoneName: 'short' }).split(' ')[2]?.match(/[-+]\d+/)?.[0] || '0'
    defaultCities.value.push({ name, timezone, offset: Number.parseInt(offset, 10) || 0 })
    selectedTimezone.value = ''
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('world_time') }}
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

    <!-- 默认展示城市 -->
    <div class="mb-6 w-80">
      <div v-for="city in defaultCities" :key="city.timezone" class="mb-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
        <h3 class="text-xl text-gray-800 font-semibold dark:text-white">
          {{ city.name }}
        </h3>
        <p class="text-lg text-gray-600 dark:text-gray-300" style="font-family: 'clockicons', sans-serif;">
          {{ cityTime(city.timezone) }} {{ locale === 'en' && city.offset > 0 ? 'PM' : city.offset <= 0 ? 'AM' : '' }}
        </p>
      </div>
    </div>

    <!-- 国家选择 -->
    <div class="mb-6 w-80">
      <select
        v-model="selectedTimezone"
        class="w-full cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        @change="addCity"
      >
        <option value="" disabled>
          {{ $t('select_timezone') }}
        </option>
        <option v-for="timezone in availableTimezones" :key="timezone" :value="timezone" :disabled="defaultCities.some(c => c.timezone === timezone)">
          {{ timezone }}
        </option>
      </select>
    </div>

    <!-- 使用说明 -->
    <div class="mb-6 max-w-2xl">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('how_to_use_world_time') }}
      </h2>
      <div class="prose dark:prose-invert">
        <p>{{ $t('how_to_use_world_time_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 无需额外样式，保持一致 */
</style>
