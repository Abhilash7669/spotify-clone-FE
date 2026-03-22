<script setup lang="ts">
import BaseGlassPlayer from '@/components/BaseGlassPlayer.vue'
import BaseSidebar from '@/components/common/sidebar/BaseSidebar.vue'
import BaseTopBar from '@/components/common/topbar/BaseTopBar.vue'
import { ref } from 'vue'

const playerBarHeight = ref<number>(0)

</script>

<template>
  <div class="h-dvh">
    <div class="flex h-full w-full">
      <BaseSidebar class="sticky left-0 top-0" :side-bar-offset-height="playerBarHeight" />
      <div class="w-full h-screen flex-1 overflow-x-hidden scrollbar-thin bg-background pt-0">
        <BaseTopBar
          class="sticky top-0 left-0 z-20"
        />
        <div class="mb-44">
          <RouterView />
        </div>
      </div>
    </div>
    <BaseGlassPlayer />
  </div>
</template>
