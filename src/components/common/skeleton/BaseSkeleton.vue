<script setup lang="ts">
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';

  const props = defineProps<{
    class?: HTMLAttributes["class"]
  }>();
</script>


<template>
  <div :class="cn(`skeleton animate-shimmer h-3 w-full`, props.class)" />
</template>
