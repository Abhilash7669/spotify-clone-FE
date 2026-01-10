<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';

</script>

<template>
  <div
    class="flex items-center gap-4 p-3 rounded-lg">
    <BaseSkeleton class="w-8 h-4" />

    <div class="flex-1 min-w-0">
      <BaseSkeleton class="h-5 w-40" />
    </div>

    <div class="hidden sm:block flex-1 min-w-0">
      <BaseSkeleton class="h-4 w-32" />
    </div>

    <div class="hidden md:block w-32">
      <BaseSkeleton class="h-4 w-24 ml-auto" />
    </div>

    <div class="flex items-center gap-3">
      <BaseSkeleton class="h-4 w-10" />
    </div>
  </div>
</template>
