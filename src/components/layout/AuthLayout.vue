<script setup lang="ts">
import BaseSidebar from '@/components/common/sidebar/BaseSidebar.vue'
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
    <div class="flex h-full">
      <BaseSidebar :side-bar-offset-height="playerBarHeight" />
      <div class="w-full">
        <RouterView />
      </div>
    </div>
    <div
      id="player-bar"
      ref="player-bar-ref"
      class="bg-emerald-200 text-black flex items-center justify-center w-full h-[100px] fixed bottom-0 left-0"
    >
      Bottom bar
    </div>
  </div>
</template>
