<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'

const color = useColorMode()

const { t } = useI18n()

useHead({
  title: t('countdown_title'),
  meta: [
    { name: 'description', content: t('countdown_description') },
    { property: 'og:title', content: t('countdown_title') },
    { property: 'og:description', content: t('countdown_description') },
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

const selectedHoliday = ref('') // 默认空
const timeLeft = ref<number>(0)
const selectedDate = ref()
let timer: NodeJS.Timeout | null = null

const { locale } = useI18n()

// 节日列表（动态计算当前或下一年新年）
const holidays = computed(() => {
  const now = new Date()
  const currentYear = now.getFullYear()
  const nextYear = currentYear + 1

  if (locale.value === 'zh') {
    // 农历春节（示例：假设为每年 2 月 1 日，需使用农历算法计算）
    const lunarNewYearCurrent = new Date(currentYear, 1, 1) // 当前年春节（简化处理）
    const lunarNewYearNext = new Date(nextYear, 1, 1) // 下一年春节（简化处理）
    const isCurrentNewYearPassed = now > lunarNewYearCurrent
    const newYearDate = isCurrentNewYearPassed ? lunarNewYearNext : lunarNewYearCurrent

    // 检查其他节日是否已过
    const checkHoliday = (month: number, day: number) => {
      const holidayCurrent = new Date(currentYear, month, day)
      return now > holidayCurrent ? new Date(nextYear, month, day) : holidayCurrent
    }

    return [
      { label: '春节', value: newYearDate.toISOString().split('T')[0] },
      { label: '元旦', value: checkHoliday(0, 1).toISOString().split('T')[0] },
      { label: '清明节', value: checkHoliday(3, 5).toISOString().split('T')[0] },
      { label: '劳动节', value: checkHoliday(4, 1).toISOString().split('T')[0] },
      { label: '端午节', value: checkHoliday(5, 22).toISOString().split('T')[0] }, // 示例，需动态计算
      { label: '中秋节', value: checkHoliday(8, 15).toISOString().split('T')[0] }, // 示例，需动态计算
      { label: '国庆节', value: checkHoliday(9, 1).toISOString().split('T')[0] },
    ]
  }
  else {
    // 英文新年（1 月 1 日）
    const newYearCurrent = new Date(currentYear, 0, 1)
    const newYearNext = new Date(nextYear, 0, 1)
    const isCurrentNewYearPassed = now > newYearCurrent
    const newYearDate = isCurrentNewYearPassed ? newYearNext : newYearCurrent

    // 检查其他节日是否已过
    const checkHoliday = (month: number, day: number) => {
      const holidayCurrent = new Date(currentYear, month, day)
      return now > holidayCurrent ? new Date(nextYear, month, day) : holidayCurrent
    }

    return [
      { label: 'New Year\'s Day', value: newYearDate.toISOString().split('T')[0] },
      { label: 'Valentine\'s Day', value: checkHoliday(1, 14).toISOString().split('T')[0] },
      { label: 'Easter Sunday', value: checkHoliday(3, 4).toISOString().split('T')[0] }, // 示例，需动态计算
      { label: 'Independence Day', value: checkHoliday(6, 4).toISOString().split('T')[0] },
      { label: 'Thanksgiving', value: checkHoliday(10, 23).toISOString().split('T')[0] }, // 示例，需动态计算
      { label: 'Christmas', value: checkHoliday(11, 25).toISOString().split('T')[0] },
    ]
  }
})

// 默认选择第一个未到的节日
onMounted(() => {
  const firstHoliday = holidays.value[0]
  selectedHoliday.value = firstHoliday!.value! // 默认选择第一个节日
})

// 格式化倒数时间（支持中文）
const formattedTimeLeft = computed(() => {
  const days = Math.floor(timeLeft.value / (24 * 3600))
  const hours = Math.floor((timeLeft.value % (24 * 3600)) / 3600)
  const minutes = Math.floor((timeLeft.value % 3600) / 60)
  const seconds = timeLeft.value % 60
  const [d, h, m, s] = [days, hours, minutes, seconds].map(n => n.toString().padStart(2, '0'))
  return [
    { label: t('day'), value: d },
    { label: t('hour'), value: h },
    { label: t('minute'), value: m },
    { label: t('second'), value: s },
  ]
})

// 计算倒数
watch(selectedHoliday, (newVal) => {
  if (newVal) {
    const targetDate = new Date(newVal)
    const updateCountdown = () => {
      const now = new Date()
      const diff = Math.floor((targetDate.getTime() - now.getTime()) / 1000)
      timeLeft.value = diff > 0 ? diff : 0
    }
    updateCountdown()
    if (timer)
      clearInterval(timer)
    timer = setInterval(updateCountdown, 1000)
  }
  else {
    timeLeft.value = 0
    if (timer)
      clearInterval(timer)
  }
})

// 计算倒数
watch(selectedDate, (newVal) => {
  const targetDate = newVal ? new Date(newVal) : new Date(selectedHoliday.value)
  const updateCountdown = () => {
    const now = new Date()
    const diff = Math.floor((targetDate.getTime() - now.getTime()) / 1000)
    timeLeft.value = diff > 0 ? diff : 0
  }
  updateCountdown()
  if (timer)
    clearInterval(timer)
  timer = setInterval(updateCountdown, 1000)
})

onUnmounted(() => clearInterval(timer!))
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4 transition-colors dark:bg-gray-900">
    <h1 class="mb-8 text-5xl text-gray-800 font-bold dark:text-white">
      {{ $t('online_countdown') }}
    </h1>

    <!-- 日期时间选择 -->
    <div class="mb-6 w-80">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('custom_date') }}
      </h2>
      <VueDatePicker
        v-model="selectedDate"
        :locale="locale"
        :placeholder="$t('custom_date')"
        :auto-apply="true"
        :week-start="locale === 'zh' ? 1 : 0"
        :dark="color.value === 'dark'"
        class="w-full"
      />
    </div>

    <!-- 节日快捷选择 -->
    <div v-if="!selectedDate" class="mb-6 w-80">
      <select
        v-model="selectedHoliday"
        class="w-full cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="" disabled>
          {{ $t('select_holiday') }}
        </option>
        <option v-for="holiday in holidays" :key="holiday.value" :value="holiday.value">
          {{ holiday.label }}
        </option>
      </select>
    </div>

    <!-- 倒数显示 -->
    <div v-if="(selectedHoliday && timeLeft > 0) || (selectedDate && timeLeft > 0)" class="mb-6 text-center">
      <div class="flex flex-col items-center justify-center rounded-md bg-white p-4 shadow-sm dark:bg-gray-800">
        <div class="flex gap-6 text-5xl text-gray-800 dark:text-white">
          <div v-for="item in formattedTimeLeft" :key="item.label">
            <div class="text-gray-800 dark:text-white">
              {{ item.value }}
            </div>
            <div class="mt-2 text-base text-gray-500 dark:text-gray-400">
              {{ item.label }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="(selectedHoliday && timeLeft <= 0) || (selectedDate && timeLeft <= 0)" class="rounded-md bg-white p-4 text-2xl text-gray-800 shadow-sm dark:bg-gray-800 dark:text-white">
      {{ $t('holiday_reached') }}
    </div>

    <!-- 使用说明 -->
    <div class="mb-6 mt-4 max-w-2xl">
      <h2 class="mb-4 text-2xl text-gray-800 font-bold dark:text-white">
        {{ $t('how_to_use_countdown') }}
      </h2>
      <div class="prose dark:prose-invert">
        <p>{{ $t('how_to_use_countdown_desc') }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 无需额外样式，保持一致 */
</style>
