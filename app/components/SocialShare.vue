<script setup lang="ts">
const { t } = useI18n()
const url = ref(window.location.href)
const title = ref(t('title'))

const twitterShareUrl = computed(
  () => `https://twitter.com/intent/tweet?url=${encodeURIComponent(url.value)}&text=${encodeURIComponent(title.value)}`,
)
const facebookShareUrl = computed(
  () => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url.value)}`,
)
const threadsShareUrl = computed(
  () => `https://www.threads.net/intent/post?text=${encodeURIComponent(`${title.value} ${url.value}`)}`,
)
const redditShareUrl = computed(
  () => `https://www.reddit.com/submit?url=${encodeURIComponent(url.value)}&title=${encodeURIComponent(title.value)}`,
)
const weiboShareUrl = computed(
  () => `http://service.weibo.com/share/share.php?url=${encodeURIComponent(url.value)}&title=${encodeURIComponent(title.value)}`,
)
</script>

<template>
  <div class="flex gap-4">
    <a :href="twitterShareUrl" target="_blank" title="Share on Twitter">
      <div class="i-logos-twitter h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400" />
    </a>
    <a :href="facebookShareUrl" target="_blank" title="Share on Facebook">
      <div class="i-logos-facebook h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-600" />
    </a>
    <a :href="threadsShareUrl" target="_blank" title="Share on Threads">
      <div class="h-8 w-8 flex items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600">
        <div class="i-ri-threads-fill h-5 w-5" />
      </div>
    </a>
    <a :href="redditShareUrl" target="_blank" title="Share on Reddit">
      <div class="i-logos-reddit-icon h-8 w-8 text-gray-600 transition-colors dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400" />
    </a>
    <a :href="weiboShareUrl" target="_blank" title="Share on Weibo">
      <div class="h-8 w-8 flex items-center justify-center rounded-full bg-red-500 text-white transition-colors hover:bg-red-600">
        <div class="i-ri-weibo-fill h-5 w-5" />
      </div>
    </a>
  </div>
</template>
