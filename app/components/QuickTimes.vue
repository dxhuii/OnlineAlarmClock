<script setup lang="ts">
const emit = defineEmits<{
  (e: 'setQuickTimeAndStart', hour: string, minute: string): void
}>()

const quickTimes = [
  { label: '05:00', hour: '05', minute: '00' },
  { label: '05:30', hour: '05', minute: '30' },
  { label: '06:00', hour: '06', minute: '00' },
  { label: '06:30', hour: '06', minute: '30' },
  { label: '07:00', hour: '07', minute: '00' },
  { label: '07:30', hour: '07', minute: '30' },
  { label: '08:00', hour: '08', minute: '00' },
  { label: '08:30', hour: '08', minute: '30' },
]

function setQuickTimeAndStart(hour: string, minute: string) {
  emit('setQuickTimeAndStart', hour, minute)
}
</script>

<template>
  <div class="mb-6 w-80 flex flex-wrap justify-center gap-2">
    <button
      v-for="time in quickTimes"
      :key="time.label"
      class="rounded-lg bg-gray-200 px-4 py-2 text-sm text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600"
      @click="setQuickTimeAndStart(time.hour, time.minute)"
    >
      {{ time.label }}
    </button>
  </div>
</template>
