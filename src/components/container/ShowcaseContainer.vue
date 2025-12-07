<script setup lang="ts">
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';


const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

</script>

<template>
  <ul :class="cn('grid grid-cols-[repeat(auto-fit,minmax(140px,200px))] gap-6 w-full h-full', props.class)">
    <slot />
  </ul>
</template>
