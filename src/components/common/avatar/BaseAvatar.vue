<script setup lang="ts">
import { avatarBaseClass } from '@/components/common/avatar';
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';

const props = defineProps<{
  class?: HTMLAttributes["class"];
  src: string | undefined | null;
}>()


</script>

<template>
    <div v-if="!props.src" :class="cn(`${avatarBaseClass.class} animate-shimmer skeleton`, props.class)"></div>
    <img v-else :class="cn(`${avatarBaseClass.class} object-cover`, props.class)" :src="props.src" alt="profile-picture">
</template>


