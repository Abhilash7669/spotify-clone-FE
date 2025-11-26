<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardTitle = {
  class?: HTMLAttributes['class']
}
const props = defineProps<CardTitle>()
</script>

<template>
  <h3
    data-slot="card-title"
    :class="cn('leading-none font-semibold text-2xl md:min-w-xs', props.class)"
  >
    <slot />
  </h3>
</template>
