<script setup lang="ts" generic="T">
import { apiClient } from '@/api/api';
import CardShowcaseSkeleton from '@/components/common/skeleton/CardShowcaseSkeleton.vue';
import ShowcaseContainer from '@/components/container/ShowcaseContainer.vue';
import ShowcaseScrollableContainer from '@/components/container/ShowcaseScrollableContainer.vue';
import { useApi } from '@/composables/useApi';
import type { PaginatedApiResponse } from '@/lib/types/common.type';
import { computed, onMounted, ref } from 'vue';

const props = defineProps<{
  title: string;
  link: string;
  apiOptions: {
    endpoint: string;
  }
}>();


const limit = ref<number>(10);

const { data, isLoading, isSuccess, execute, error, isError } = useApi<PaginatedApiResponse<T>>({
  dataFn: () => apiClient.get<PaginatedApiResponse<T>>({
    endpoint: props.apiOptions.endpoint,
    urlParams: {
      limit: limit.value.toString()
    }
  })
});

const responseData = computed(() => data.value as PaginatedApiResponse<T>);

onMounted(async () => {
  await execute();
})
</script>

<template>
  <section class="h-auto flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">
        {{ props.title || 'Title' }}
      </h2>

      <RouterLink class="hover:underline" :to="props.link">
        See all
      </RouterLink>
    </div>
    <p class="text-sm text-red-500" v-if="isError && error">
      {{ error }}
    </p>
    <ShowcaseScrollableContainer v-if="isLoading && !data && !responseData">
      <CardShowcaseSkeleton />
    </ShowcaseScrollableContainer>
      <div class="h-full flex" v-if="isSuccess && data && responseData">
        <ShowcaseContainer>
          <slot :items="responseData.data" />
        </ShowcaseContainer>
      </div>
  </section>
</template>
