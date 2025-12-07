<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { AUTH_UTILS } from '@/utils/auth';
import { cn } from '@/utils/cn';
import type { HTMLAttributes } from 'vue';
import { useRouter } from 'vue-router';

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

const router = useRouter();

function handleLogout() {
  AUTH_UTILS.removeToken();
  router.push("/login");
}

</script>

<template>
  <Button :class="cn('', props.class)" @click="handleLogout" variants="destructive">
    Logout
  </Button>
</template>
