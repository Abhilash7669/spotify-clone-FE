<script setup lang="ts">
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';


const props = defineProps<{
  class?: HTMLAttributes['class']
}>()

</script>

<template>
  <div :class="cn('rounded-2xl border border-border/30 p-4 bg-linear-to-br from-card/50 to-card/20' ,props.class)">
    <slot />
  </div>
</template>
