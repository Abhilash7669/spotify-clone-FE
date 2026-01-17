<script setup lang="ts">
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

</script>


<template>
  <div :class="cn('p-4 rounded-xl bg-linear-to-br from-primary/30 to-primary/10 border border-white/10 backdrop-blur-lg', props.class)">
    <slot />
  </div>
</template>
