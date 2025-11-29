<script setup lang="ts">
import { apiClient } from '@/api/api';
import BaseAvatar from '@/components/common/avatar/BaseAvatar.vue';
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import { useApi } from '@/composables/useApi';
import type { CommonApiResponse } from '@/lib/types/auth/login.type';
import type { AuthUser } from '@/lib/types/auth/user.type';
import { cn } from '@/utils/cn';
import { computed, onMounted, type HTMLAttributes } from 'vue';

  const props = defineProps<{
    class?: HTMLAttributes["class"]
  }>()

  const { data, error, execute, isError, isLoading, isSuccess} = useApi<AuthUser, CommonApiResponse<AuthUser>>({
    dataFn: () => apiClient.get<CommonApiResponse<AuthUser>>({endpoint: '/users/me'})
  });

  const userData = computed(() => data.value);

  onMounted(async () => {
    await execute();
    if(isSuccess) console.log(userData.value);
  })

</script>

<template>
  <header :class="cn('w-full flex items-center justify-between px-8 py-4 bg-background/80 backdrop-blur-md border-b border-border/50', props.class)">
    <p class="text-red-500 text-sm" v-if="isError && error">
      {{ error }}
    </p>
    <BaseSkeleton
      v-if="isLoading && !data"
      class="h-4 w-20"
    />
    <h2 v-if="isSuccess && data">
      Welcome {{ userData?.name }}
    </h2>
    <div>
      <BaseAvatar
        :src="userData?.profilePicture"
      />
    </div>
  </header>
</template>
