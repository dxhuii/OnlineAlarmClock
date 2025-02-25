<script setup lang="ts">
import { Howl } from 'howler'

const { t } = useI18n()

const selectedSound = defineModel<string>('selectedSound', { required: true })
const isPlaying = ref(false) // 跟踪播放状态

const sounds = computed(() => [
  { id: 1, name: t('bells'), file: '/sounds/bells.mp3' },
  { id: 2, name: t('birds'), file: '/sounds/birds.mp3' },
  { id: 3, name: t('childhood'), file: '/sounds/childhood.mp3' },
  { id: 4, name: t('classic'), file: '/sounds/classic.mp3' },
  { id: 5, name: t('cuckoo'), file: '/sounds/cuckoo.mp3' },
  { id: 6, name: t('flute'), file: '/sounds/flute.mp3' },
  { id: 7, name: t('glow'), file: '/sounds/glow.mp3' },
  { id: 8, name: t('guitar'), file: '/sounds/guitar.mp3' },
  { id: 9, name: t('happy'), file: '/sounds/happy.mp3' },
  { id: 10, name: t('harp'), file: '/sounds/harp.mp3' },
  { id: 11, name: t('music_box'), file: '/sounds/music-box.mp3' },
  { id: 12, name: t('paradise_island'), file: '/sounds/paradise-island.mp3' },
  { id: 13, name: t('piano'), file: '/sounds/piano.mp3' },
  { id: 14, name: t('pipe'), file: '/sounds/pipe.mp3' },
  { id: 15, name: t('pizzicato'), file: '/sounds/pizzicato.mp3' },
  { id: 16, name: t('rooster'), file: '/sounds/rooster.mp3' },
  { id: 17, name: t('savannah'), file: '/sounds/savannah.mp3' },
  { id: 18, name: t('school'), file: '/sounds/school.mp3' },
  { id: 19, name: t('twinkle'), file: '/sounds/twinkle.mp3' },
  { id: 20, name: t('wind_chimes'), file: '/sounds/wind-chimes.mp3' },
  { id: 21, name: t('xylophone'), file: '/sounds/xylophone.mp3' },
])

const previewAudio = ref<any>(null)

function previewSound() {
  if (previewAudio.value) {
    // 如果正在播放，点击停止
    if (isPlaying.value) {
      previewAudio.value.stop()
      isPlaying.value = false
    }
    else {
      // 如果未播放，重新播放
      previewAudio.value.stop()
      previewAudio.value = new Howl({
        src: [selectedSound.value],
        loop: false,
        onplay: () => { isPlaying.value = true },
        onend: () => { isPlaying.value = false },
        onstop: () => { isPlaying.value = false },
      })
      previewAudio.value.play()
    }
  }
  else {
    // 初始播放
    previewAudio.value = new Howl({
      src: [selectedSound.value],
      loop: false,
      onplay: () => { isPlaying.value = true },
      onend: () => { isPlaying.value = false },
      onstop: () => { isPlaying.value = false },
    })
    previewAudio.value.play()
  }
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
