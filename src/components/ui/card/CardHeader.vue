<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardHeader = {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardHeader>()
</script>

<template>
  <div data-slot="card-header" :class="cn('flex flex-col gap-1.5 px-6', props.class)">
    <slot />
  </div>
</template>
