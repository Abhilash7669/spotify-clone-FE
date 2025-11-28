<script setup lang="ts">
import BaseSidebarMenu from '@/components/common/sidebar/BaseSidebarMenu.vue'
import { useSideBar } from '@/composables/useSideBar'
import { Icon } from '@iconify/vue'

const props = defineProps<{
  sideBarOffsetHeight?: number
}>()

const { sideBarWidth, toggleSideBar, isSideBarOpen } = useSideBar()
</script>

<template>
  <aside
    :style="{
      height: `calc(100dvh - ${props.sideBarOffsetHeight ?? 0}px)`,
      width: `${sideBarWidth}px`,
    }"
    :class="`transition-all duration-300 whitespace-nowrap flex flex-col bg-sidebar border-r border-sidebar-border overflow-hidden gap-4`"
  >
    <div
      :class="`flex items-center whitespace-nowrap transition-all duration-300 py-2 delay-300 ${isSideBarOpen ? 'gap-0.5 px-3' : 'gap-0 px-2'}`"
    >
      <div
        :class="`flex whitespace-nowrap overflow-hidden text-2xl font-bold bg-clip-text text-transparent bg-gradient-primary transition-all duration-300 ${!isSideBarOpen ? 'animate-fade-out w-0' : `animate-fade-in w-[90px]`}`"
      >
        <p ref="header-text">Spotify</p>
      </div>
      <Icon @click="toggleSideBar" class="cursor-pointer z-10 w-5 h-5" icon="lucide:sidebar" />
    </div>
    <div>
      <BaseSidebarMenu />
    </div>
  </aside>
</template>
