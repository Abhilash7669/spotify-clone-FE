<script setup lang="ts">
import Label from '@/components/ui/label/Label.vue'
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  class?: HTMLAttributes['class']
  label: string
  for: string
}>()
</script>

<template>
  <div data-slot="base-input-group" :class="cn('flex flex-col gap-1.5', props.class)">
    <Label :for="props.for">
      {{ props.label }}
    </Label>
    <slot />
  </div>
</template>
