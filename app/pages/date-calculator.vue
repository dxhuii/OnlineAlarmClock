<script setup lang="ts">
// 引入第三方日期选择库
import DatePicker from '@vuepic/vue-datepicker'

const color = useColorMode()

const { t } = useI18n()

useHead({
  title: t('date_calculator_title'),
  meta: [
    { name: 'description', content: t('date_calculator_description') },
    { property: 'og:title', content: t('date_calculator_title') },
    { property: 'og:description', content: t('date_calculator_description') },
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

const activeTab = ref('daysBetween')
const startDate = ref('')
const endDate = ref('')
const years = ref(0)
const months = ref(0)
const weeks = ref(0)
const days = ref(0)
const daysResult = ref<number | null>(null)
const addResult = ref<string | null>(null)
const subtractResult = ref<string | null>(null)

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

// 设置今天
function setToday(type: 'start' | 'end') {
  const now = new Date()
  const dateStr = now.toISOString().split('T')[0]
  if (type === 'start')
    startDate.value = dateStr!
  else endDate.value = dateStr!
  calculateDays()
}

// 计算天数
function calculateDays() {
  if (!startDate.value || !endDate.value) {
    daysResult.value = null
    return
  }
  const start = startDate.value ? new Date(startDate.value) : null
  const end = endDate.value ? new Date(endDate.value) : null
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    daysResult.value = null
    return
  }
  const diff = Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
  daysResult.value = diff
}

// 计算加上天数
function calculateAddDays() {
  if (!startDate.value) {
    addResult.value = null
    return
  }
  const start = startDate.value ? new Date(startDate.value) : null
  if (!start || Number.isNaN(start.getTime())) {
    addResult.value = null
    return
  }
  const totalDays = years.value * 365 + months.value * 30 + weeks.value * 7 + days.value
  start.setDate(start.getDate() + totalDays)
  addResult.value = start.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
}

// 计算减去天数
function calculateSubtractDays() {
  if (!startDate.value) {
    subtractResult.value = null
    return
  }
  const start = startDate.value ? new Date(startDate.value) : null
  if (!start || Number.isNaN(start.getTime())) {
    subtractResult.value = null
    return
  }
  const totalDays = years.value * 365 + months.value * 30 + weeks.value * 7 + days.value
  start.setDate(start.getDate() - totalDays)
  subtractResult.value = start.toLocaleDateString(locale.value, { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('date_calculator') }}
    </h1>

    <!-- 选项卡 -->
    <div class="mb-6 w-80">
      <div class="flex gap-2">
        <button
          :class="[activeTab === 'daysBetween' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600']"
          class="whitespace-nowrap rounded-lg px-4 py-2 text-lg transition-colors"
          @click="activeTab = 'daysBetween'"
        >
          {{ $t('days_between') }}
        </button>
        <button
          :class="[activeTab === 'addDays' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600']"
          class="whitespace-nowrap rounded-lg px-4 py-2 text-lg transition-colors"
          @click="activeTab = 'addDays'"
        >
          {{ $t('add_days') }}
        </button>
        <button
          :class="[activeTab === 'subtractDays' ? 'bg-blue-600 text-white dark:bg-blue-500 dark:hover:bg-blue-600' : 'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600']"
          class="whitespace-nowrap rounded-lg px-4 py-2 text-lg transition-colors"
          @click="activeTab = 'subtractDays'"
        >
          {{ $t('subtract_days') }}
        </button>
      </div>
    </div>

    <!-- 计算内容 -->
    <div class="mb-6 w-80">
      <div v-if="activeTab === 'daysBetween'">
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('start_date') }}</label>
            <button class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600" @click="setToday('start')">
              {{ $t('today') }}
            </button>
          </div>
          <DatePicker
            v-model="startDate"
            :locale="locale"
            :placeholder="$t('start_date')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="mt-3 w-full"
            @update:model-value="calculateDays"
          />
        </div>
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('end_date') }}</label>
            <button class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600" @click="setToday('end')">
              {{ $t('today') }}
            </button>
          </div>
          <DatePicker
            v-model="endDate"
            :locale="locale"
            :placeholder="$t('start_date')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="mt-3 w-full"
            @update:model-value="calculateDays"
          />
        </div>
        <p v-if="daysResult" class="text-2xl text-gray-800 dark:text-white">
          {{ $t('days_between_result', { days: daysResult }) }}
        </p>
      </div>
      <div v-if="activeTab === 'addDays'">
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('start_date') }}</label>
            <button class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600" @click="setToday('start')">
              {{ $t('today') }}
            </button>
          </div>
          <DatePicker
            v-model="startDate"
            :locale="locale"
            :placeholder="$t('start_date')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="mt-3 w-full"
            @update:model-value="calculateAddDays"
          />
        </div>
        <div class="mb-2 flex gap-2">
          <div class="w-1/4">
            {{ $t('year') }}
          </div>
          <div class="w-1/4">
            {{ $t('month') }}
          </div>
          <div class="w-1/4">
            {{ $t('week') }}
          </div>
          <div class="w-1/4">
            {{ $t('day') }}
          </div>
        </div>
        <div class="mb-4 flex gap-2">
          <input
            v-model="years"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Years"
            @input="calculateAddDays"
          >
          <input
            v-model="months"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Months"
            @input="calculateAddDays"
          >
          <input
            v-model="weeks"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Weeks"
            @input="calculateAddDays"
          >
          <input
            v-model="days"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Days"
            @input="calculateAddDays"
          >
        </div>
        <p v-if="addResult" class="text-2xl text-gray-800 dark:text-white">
          {{ $t('add_days_result', { date: addResult }) }}
        </p>
      </div>
      <div v-if="activeTab === 'subtractDays'">
        <div class="mb-4">
          <div class="flex items-center justify-between">
            <label class="text-lg text-gray-800 font-semibold dark:text-white">{{ $t('start_date') }}</label>
            <button class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600" @click="setToday('start')">
              {{ $t('today') }}
            </button>
          </div>
          <DatePicker
            v-model="startDate"
            :locale="locale"
            :placeholder="$t('start_date')"
            :auto-apply="true"
            :week-start="locale === 'zh' ? 1 : 0"
            :dark="color.value === 'dark'"
            class="mt-3 w-full"
            @update:model-value="calculateSubtractDays"
          />
        </div>
        <div class="mb-2 flex gap-2">
          <div class="w-1/4">
            {{ $t('year') }}
          </div>
          <div class="w-1/4">
            {{ $t('month') }}
          </div>
          <div class="w-1/4">
            {{ $t('week') }}
          </div>
          <div class="w-1/4">
            {{ $t('day') }}
          </div>
        </div>
        <div class="mb-4 flex gap-2">
          <input
            v-model="years"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Years"
            @input="calculateSubtractDays"
          >
          <input
            v-model="months"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Months"
            @input="calculateSubtractDays"
          >
          <input
            v-model="weeks"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Weeks"
            @input="calculateSubtractDays"
          >
          <input
            v-model="days"
            type="number"
            min="0"
            class="w-1/4 border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Days"
            @input="calculateSubtractDays"
          >
        </div>
        <p v-if="subtractResult" class="text-2xl text-gray-800 dark:text-white">
          {{ $t('subtract_days_result', { date: subtractResult }) }}
        </p>
      </div>
    </div>

    <!-- 使用说明 -->
    <div class="mb-6 max-w-2xl">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('how_to_use_date_calculator') }}
      </h2>
      <div class="prose dark:prose-invert">
        <p>{{ $t('how_to_use_date_calculator_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义 DatePicker 样式以匹配项目风格 */
.vdp-datepicker {
  @apply w-full p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 transition-all;
}

.vdp-datepicker__calendar {
  @apply bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg;
}

.vdp-datepicker__calendar-header {
  @apply bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300;
}

.vdp-datepicker__calendar-body button {
  @apply text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600;
}

.vdp-datepicker__calendar-body button.is-selected {
  @apply bg-blue-600 text-white dark:bg-blue-500;
}
</style>
