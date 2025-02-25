<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'

const color = useColorMode()

const { t } = useI18n()

useHead({
  title: t('hours_calculator_title'),
  meta: [
    { name: 'description', content: t('hours_calculator_description') },
    { property: 'og:title', content: t('hours_calculator_title') },
    { property: 'og:description', content: t('hours_calculator_description') },
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

const startTime = ref()
const endTime = ref()
const hoursResult = ref<number | null>(null)

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

// 计算小时数
function calculateHours() {
  if (!startTime.value || !endTime.value) {
    hoursResult.value = null
    return
  }
  const { hours: startHour, minutes: startMinute } = startTime.value
  const { hours: endHour, minutes: endMinute } = endTime.value
  if (Number.isNaN(startHour) || Number.isNaN(startMinute) || Number.isNaN(endHour) || Number.isNaN(endMinute)) {
    hoursResult.value = null
    return
  }

  console.log('startHour:', startHour)
  console.log('startMinute:', startMinute)
  console.log('endHour:', endHour)
  console.log('endMinute:', endMinute)

  const startTotalMinutes = startHour! * 60 + startMinute!
  let endTotalMinutes = endHour! * 60 + endMinute!

  // 处理跨日情况
  if (endTotalMinutes < startTotalMinutes) {
    endTotalMinutes += 24 * 60 // 假设跨了一天
  }

  const diffMinutes = endTotalMinutes - startTotalMinutes
  hoursResult.value = Number.parseFloat((Math.floor(diffMinutes / 60) + (diffMinutes % 60) / 60).toFixed(2)) // 转换为小时（保留小数）
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('hours_calculator') }}
    </h1>

    <!-- 小时数计算 -->
    <div class="mb-6 w-80">
      <div class="mb-4">
        <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('start_time') }}</label>
        <div class="mt-3 flex items-center gap-2">
          <VueDatePicker
            v-model="startTime"
            time-picker
            :locale="locale"
            :placeholder="$t('start_time')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="w-full"
            @update:model-value="calculateHours"
          />
        </div>
      </div>
      <div class="mb-4">
        <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('end_time') }}</label>
        <div class="mt-3 flex items-center gap-2">
          <VueDatePicker
            v-model="endTime"
            time-picker
            :locale="locale"
            :placeholder="$t('end_time')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="w-full"
            @update:model-value="calculateHours"
          />
        </div>
      </div>
      <p v-if="hoursResult" class="break-words text-2xl text-gray-800 dark:text-white">
        {{ $t('hours_result', { hours: hoursResult }) }}
      </p>
    </div>

    <!-- 使用说明 -->
    <div class="mb-6 max-w-2xl">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('how_to_use_hours_calculator') }}
      </h2>
      <div class="prose dark:prose-invert">
        <p>{{ $t('how_to_use_hours_calculator_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义 TimePicker 样式以匹配项目风格 */
.vue-timepicker {
  @apply w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all;
}

.vue-timepicker__input {
  @apply text-lg w-full;
}

.vue-timepicker__list {
  @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg;
}

.vue-timepicker__list-item {
  @apply text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.vue-timepicker__list-item--selected {
  @apply bg-blue-600 text-white dark:bg-blue-500;
}
</style>
