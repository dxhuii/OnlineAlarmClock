<script setup lang="ts">
const url = ref(window.location.href)
const title = ref('Check out this cool Alarm Clock app!')

const twitterShareUrl = computed(
  () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url.value)}&text=${encodeURIComponent(title.value)}`,
)
const facebookShareUrl = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.value)}`,
)
const instagramShareUrl = computed(
  () => `https://www.instagram.com/?url=${encodeURIComponent(url.value)}`,
)
</script>

<template>
  <div class="flex gap-4">
    <a :href="twitterShareUrl" target="_blank" title="Share on Twitter">
      <div class="i-logos:twitter h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" />
    </a>
    <a :href="facebookShareUrl" target="_blank" title="Share on Facebook">
      <div class="i-logos:facebook h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-600" />
    </a>
    <a :href="instagramShareUrl" target="_blank" title="Share on Instagram">
      <div class="i-logos:instagram-icon h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-pink-500 dark:hover:text-pink-400" />
    </a>
  </div>
</template>
