<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardDescription = {
  class?: HTMLAttributes['class']
}

const props = defineProps<CardDescription>()
</script>

<template>
  <p data-slot="card-description" :class="cn('text-muted-foreground text-sm', props.class)">
    <slot />
  </p>
</template>
