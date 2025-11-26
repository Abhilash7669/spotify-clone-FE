<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  for: string
}>()
</script>

<template>
  <label data-slot="label" :for="props.for" :class="cn('text-sm font-medium', props.class)">
    <slot />
  </label>
</template>
