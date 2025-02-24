<script setup lang="ts">
import { Howl } from 'howler'

const selectedSound = defineModel<string>('selectedSound', { required: true })
const isPlaying = ref(false) // 跟踪播放状态

const sounds = [
  { id: 1, name: 'Classic Bell', file: '/alarm.mp3' },
  { id: 2, name: 'Soft Chime', file: '/soft-chime.mp3' },
  { id: 3, name: 'Morning Rooster', file: '/rooster.mp3' },
  { id: 4, name: 'Electronic Beep', file: '/beep.mp3' },
]

const previewAudio = ref<any>(null)

function previewSound() {
  if (previewAudio.value) {
    previewAudio.value.stop()
    isPlaying.value = false
  }
  previewAudio.value = new Howl({
    src: [selectedSound.value],
    loop: false,
    onplay: () => { isPlaying.value = true },
    onend: () => { isPlaying.value = false },
    onstop: () => { isPlaying.value = false },
  })
  previewAudio.value.play()
}

onUnmounted(() => {
  if (previewAudio.value) {
    previewAudio.value.unload()
  }
})
</script>

<template>
  <div class="mb-6 w-80">
    <label class="mb-2 block text-lg text-gray-800 font-semibold dark:text-white">
      {{ $t('select_sound') }}
    </label>
    <div class="flex items-center gap-2">
      <select
        v-model="selectedSound"
        class="flex-1 cursor-pointer appearance-none border border-gray-300 rounded-lg bg-white p-3 text-lg text-gray-900 transition-all dark:border-gray-700 dark:bg-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option v-for="sound in sounds" :key="sound.id" :value="sound.file">
          {{ sound.name }}
        </option>
      </select>
      <button
        class="rounded-lg bg-gray-200 p-2 text-gray-800 transition-colors dark:bg-gray-700 hover:bg-gray-300 dark:text-white dark:hover:bg-gray-600"
        @click="previewSound"
      >
        <div class="i-mdi-motion-play-outline h-5 w-5" :class="[{ 'animate-spin': isPlaying }]" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
