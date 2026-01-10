<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';

</script>
<template>
  <div
    class="p-3 rounded-xl bg-card/20"
  >
    <BaseSkeleton class="aspect-square rounded-lg mb-3" />
    <BaseSkeleton class="h-4 w-3/4 mb-2" />
    <BaseSkeleton class="h-3 w-1/2" />
  </div>
</template>
