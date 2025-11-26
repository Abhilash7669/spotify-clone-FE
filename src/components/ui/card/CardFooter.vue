<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardFooter = {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardFooter>()
</script>

<template>
  <div data-slot="card-footer" :class="cn('flex items-center px-6 [.border-t]:pt-6', props.class)">
    <slot />
  </div>
</template>
