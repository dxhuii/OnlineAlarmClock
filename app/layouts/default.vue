<script setup lang="ts">
import type { RouteNamedMapI18n } from 'vue-router/auto-routes'

const localePath = useLocalePath()
const { setLocale } = useI18n()
const isMenuOpen = ref(false) // 控制移动端菜单显示

// 切换语言
const switchLocale = (locale: string) => setLocale(locale as 'en' | 'zh')

// 判断当前路由是否激活
const route = useRoute()
function isActive(path: string) {
  return route.path === localePath(path as keyof RouteNamedMapI18n)
}
</script>

<template>
  <div class="min-h-screen flex bg-gray-100 transition-colors dark:bg-gray-900">
    <!-- 侧边菜单 -->
    <nav class="fixed z-10 hidden h-screen w-64 bg-white p-4 shadow-lg md:block dark:bg-gray-800">
      <h2 class="mb-6 flex items-center gap-2 text-2xl text-gray-800 font-bold dark:text-white">
        <div class="i-mdi-menu h-6 w-6" />
        {{ $t('menu') }}
      </h2>
      <ul class="space-y-2">
        <li>
          <NuxtLink :to="localePath('index')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('index') }">
            <div class="i-mdi-alarm h-5 w-5" />
            {{ $t('online_alarm') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('timer')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('timer') }">
            <div class="i-mdi-timer h-5 w-5" />
            {{ $t('online_timer') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('stopwatch')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('stopwatch') }">
            <div class="i-mdi-stopwatch h-5 w-5" />
            {{ $t('online_stopwatch') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('countdown')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('countdown') }">
            <div class="i-mdi-chevron-down-circle h-5 w-5" />
            {{ $t('online_countdown') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('world-time')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('world-time') }">
            <div class="i-mdi-earth h-5 w-5" />
            {{ $t('world_time') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('date-calculator')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('date-calculator') }">
            <div class="i-mdi-calendar h-5 w-5" />
            {{ $t('date_calculator') }}
          </NuxtLink>
        </li>
        <li>
          <NuxtLink :to="localePath('hours-calculator')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('hours-calculator') }">
            <div class="i-mdi-clock-time-eight h-5 w-5" />
            {{ $t('hours_calculator') }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- 移动端菜单按钮和抽屉 -->
    <button
      class="fixed left-4 top-4 z-50 rounded-lg bg-white p-2 shadow-md md:hidden dark:bg-gray-800"
      @click="isMenuOpen = true"
    >
      <div class="i-mdi-menu h-6 w-6 text-gray-800 dark:text-white" />
    </button>

    <div
      v-if="isMenuOpen"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden"
      @click.self="isMenuOpen = false"
    >
      <div
        class="absolute left-0 top-0 h-screen w-64 transform bg-white p-4 shadow-lg transition-transform duration-300 dark:bg-gray-800"
        :class="{ 'translate-x-0': isMenuOpen, '-translate-x-full': !isMenuOpen }"
      >
        <div class="mb-6 flex items-center justify-between">
          <h2 class="flex items-center gap-2 text-2xl text-gray-800 font-bold dark:text-white">
            <div class="i-mdi-menu h-6 w-6" />
            Menu
          </h2>
          <button class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" @click="isMenuOpen = false">
            <div class="i-mdi-close h-6 w-6" />
          </button>
        </div>
        <ul class="space-y-2">
          <li>
            <NuxtLink :to="localePath('index')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('index') }" @click="isMenuOpen = false">
              <div class="i-mdi-alarm h-5 w-5" />
              {{ $t('online_alarm') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('timer')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('timer') }" @click="isMenuOpen = false">
              <div class="i-mdi-timer h-5 w-5" />
              {{ $t('online_timer') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('stopwatch')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('stopwatch') }" @click="isMenuOpen = false">
              <div class="i-mdi-stopwatch h-5 w-5" />
              {{ $t('online_stopwatch') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('countdown')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('countdown') }" @click="isMenuOpen = false">
              <div class="i-mdi-chevron-down-circle h-5 w-5" />
              {{ $t('online_countdown') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('world-time')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('world-time') }" @click="isMenuOpen = false">
              <div class="i-mdi-earth h-5 w-5" />
              {{ $t('world_time') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('date-calculator')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('date-calculator') }" @click="isMenuOpen = false">
              <div class="i-mdi-calendar h-5 w-5" />
              {{ $t('date_calculator') }}
            </NuxtLink>
          </li>
          <li>
            <NuxtLink :to="localePath('hours-calculator')" class="flex items-center gap-2 rounded-md p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400" :class="{ 'bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-400': isActive('hours-calculator') }" @click="isMenuOpen = false">
              <div class="i-mdi-clock-time-eight h-5 w-5" />
              {{ $t('hours_calculator') }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>

    <!-- 主要内容 -->
    <main class="flex-1 p-4">
      <div class="relative min-h-[calc(100vh-4rem)]">
        <!-- 右上角语言和暗黑模式切换 -->
        <div class="absolute right-4 top-4 flex items-center gap-2">
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
          <DarkToggle />
        </div>

        <!-- 内容 -->
        <slot />

        <!-- 底部 Footer -->
        <footer class="mt-8 text-center text-gray-600 dark:text-gray-300">
          <p>© {{ new Date().getFullYear() }} Alarm Clock. All rights reserved.</p>
        </footer>
      </div>
    </main>
  </div>
</template>

<style scoped>
.min-h-[calc\(100vh-4rem\)] {
  min-height: calc(100vh - 4rem);
}
</style>
