<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { cn } from '@/utils/cn'
import type { HTMLAttributes } from 'vue'

type BaseTextarea = {
  class?: HTMLAttributes['class']
  modelValue: string
}

const props = defineProps<BaseTextarea>()

const emits = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    v-bind="$attrs"
    :value="props.modelValue"
    @input="emits('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
    :class="
      cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        'dark:bg-input/30 border-input flex w-full min-h-20 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs',
        'transition-[color,box-shadow] outline-none resize-none',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        props.class,
      )
    "
  />
</template>
