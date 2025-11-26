<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardContent = {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardContent>()
</script>

<template>
  <div data-slot="card-content" :class="cn('px-6', props.class)">
    <slot />
  </div>
</template>
