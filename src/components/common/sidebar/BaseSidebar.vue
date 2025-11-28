<script setup lang="ts">
import { useSideBar } from '@/composables/useSideBar'
import { Icon } from '@iconify/vue'
import { ref } from 'vue'

const props = defineProps<{
  sideBarOffsetHeight?: number
}>()

const navItems = ref([
  {
    value: '/auth/home',
    label: 'Home',
  },
  {
    value: '/auth/search',
    label: 'Search',
  },
])

const { sideBarWidth, toggleSideBar, isSideBarOpen } = useSideBar()
</script>

<template>
  <aside
    :style="{
      height: `calc(100dvh - ${props.sideBarOffsetHeight ?? 0}px)`,
      width: `${sideBarWidth}px`,
    }"
    :class="`transition-all duration-300 whitespace-nowrap flex flex-col p-2 bg-sidebar border-r border-sidebar-border overflow-hidden`"
  >
    <div :class="`flex items-center transition-all duration-300 delay-300 ${isSideBarOpen ? 'gap-0.5' : 'gap-0'}`">
      <div
        :class="`flex whitespace-nowrap text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary transition-all duration-300 ${!isSideBarOpen ? 'animate-fade-out w-0' : `animate-fade-in w-[90px]`}`"
      >
        <p ref="header-text">Spotify</p>
      </div>
      <Icon
        @click="toggleSideBar"
        class="cursor-pointer z-10"
        icon="lucide:sidebar"
        width="16"
        height="16"
      />
    </div>
    <div v-if="isSideBarOpen">
      <ul>
        <li
          v-for="(item, i) in navItems"
          :key="item.value"
          :style="{ animationDelay: `${i * 0.2}s` }"
          class="opacity-0 animate-fade-slide-in flex"
        >
          <router-link class="w-full" :to="`${item.value}`">
            {{ item.label }}
          </router-link>
        </li>
      </ul>
    </div>
  </aside>
</template>
