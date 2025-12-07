<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
</script>

<template>
    <BaseSkeleton
      v-for="(_, i) in Array.from({ length: 6 })"
      :key="i"
      class="h-32 md:h-44 w-28 md:w-44 rounded-xl inline-flex shrink-0 snap-start"
    />
</template>

