<script setup lang="ts">
import { apiClient } from '@/api/api';
import BaseThemeSwitcher from '@/components/BaseThemeSwitcher.vue';
import BaseWeatherDisplay from '@/components/BaseWeatherDisplay.vue';
import BaseAvatar from '@/components/common/avatar/BaseAvatar.vue';
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import Button from '@/components/ui/button/Button.vue';
import { useApi } from '@/composables/useApi';
import type { AuthUser } from '@/lib/types/auth/user.type';
import { cn } from '@/utils/cn';
import { Icon } from '@iconify/vue';
import { computed, onMounted, type HTMLAttributes } from 'vue';

  const props = defineProps<{
    class?: HTMLAttributes["class"]
  }>()


  const { data, error, execute, isError, isLoading, isSuccess} = useApi<{ data: AuthUser }>({
    dataFn: () => apiClient.get<{ data: AuthUser }>({endpoint: '/users/me'})
  });


  const userData = computed(() => data.value);


  onMounted(async () => {
    await execute();
  })

</script>

<template>
  <header :class="cn('w-full flex items-center justify-between px-4 py-4 bg-background/80 backdrop-blur-md border-b border-border/50', props.class)">
    <p class="text-red-500 text-sm" v-if="isError && error">
      {{ error }}
    </p>
    <BaseWeatherDisplay />
    <div class="flex items-center gap-8">
      <h2 v-if="isSuccess && data">
        <span class="text-muted-foreground">Welcome,</span> {{ userData?.data.name }}
      </h2>
      <BaseSkeleton
        v-if="isLoading && !data"
        class="h-4 w-20"
      />
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-2">
          <Button variants="outline">
            <Icon icon="lucide:bell" />
          </Button>
          <BaseThemeSwitcher />
        </div>
        <BaseAvatar
          :src="userData?.data.profilePicture"
        />
      </div>
    </div>
  </header>
</template>
