<script setup lang="ts">
import BaseGlassPlayer from '@/components/BaseGlassPlayer.vue'
import BaseSidebar from '@/components/common/sidebar/BaseSidebar.vue'
import BaseTopBar from '@/components/common/topbar/BaseTopBar.vue'
import { onMounted, onUnmounted, ref, useTemplateRef } from 'vue'

const playerBarTemplateRef = useTemplateRef('player-bar-ref')
const observer = ref<ResizeObserver | undefined>()
const playerBarHeight = ref<number>(0)

onMounted(() => {
  if (!playerBarTemplateRef.value) return

  observer.value = new ResizeObserver((entries: Array<ResizeObserverEntry>) => {
    for (const entry of entries) {
      const element = entry.target

      if (element.id === 'player-bar') {
        const { height } = entry.contentRect
        playerBarHeight.value = height
      }
    }
  })

  observer.value.observe(playerBarTemplateRef.value)
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect()
})
</script>

<template>
  <div class="h-dvh">
    <div class="flex h-full w-full">
      <BaseSidebar class="sticky left-0 top-0" :side-bar-offset-height="playerBarHeight" />
      <div class="w-full h-screen flex-1 overflow-x-hidden scrollbar-thin bg-background pt-0">
        <BaseTopBar
          class="sticky top-0 left-0 z-20"
        />
        <div class="p-4 mb-44">
          <RouterView />
        </div>
      </div>
    </div>
    <BaseGlassPlayer />
  </div>
</template>
