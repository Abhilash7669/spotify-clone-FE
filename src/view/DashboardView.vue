<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue'
import { useSideBar } from '@/composables/useSideBar'

const { toggleSideBar } = useSideBar()
</script>

<template>
  <p>This is a protected dashboard route</p>
  <Button
    @click="
      () => {
        console.log('TEST')
        toggleSideBar()
      }
    "
  >
    CHild toggle sidebar
  </Button>
</template>
