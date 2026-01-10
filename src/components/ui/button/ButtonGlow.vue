<script setup lang="ts">
import type { BaseButtonVariants } from '@/components/ui/button';
import Button from '@/components/ui/button/Button.vue';
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes['class'],
  variants?: BaseButtonVariants
}>()

</script>

<template>
  <Button :variants="props.variants" :class="cn('bg-primary hover:bg-primary/90 hover:scale-105 shadow-xl shadow-primary/30 transition-all duration-300', props.class)">
    <slot />
  </Button>
</template>
