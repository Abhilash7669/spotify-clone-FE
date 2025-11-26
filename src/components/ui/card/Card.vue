<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type CardUI = {
  className?: HTMLAttributes['class']
}

const props = defineProps<CardUI>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'rounded-card bg-card text-card-foreground border flex flex-col gap-6 py-6 shadow-sm w-fit',
        props.className,
      )
    "
  >
    <slot />
  </div>
</template>
