<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
const props = defineProps<{
  title: string
  description?: string
  class?: HTMLAttributes['class']
  submit: (e: SubmitEvent) => Promise<void>
}>()
</script>

<template>
  <form @submit="props.submit" data-slot="form-container" :class="props.class">
    <Card>
      <CardHeader v-if="props.title">
        <CardTitle class="text-primary selection:bg-primary"> {{ props.title }} </CardTitle>
        <CardDescription class="selection:bg-primary" v-if="props.description">
          {{ props.description }}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <slot />
      </CardContent>
      <CardFooter v-if="$slots.footer">
        <slot name="footer" />
      </CardFooter>
    </Card>
  </form>
</template>
