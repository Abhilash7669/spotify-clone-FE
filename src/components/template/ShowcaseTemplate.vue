<script setup lang="ts" generic="T">
import { apiClient } from '@/api/api';
import CardShowcaseSkeleton from '@/components/common/skeleton/CardShowcaseSkeleton.vue';
import ShowcaseContainer from '@/components/container/ShowcaseContainer.vue';
import ShowcaseScrollableContainer from '@/components/container/ShowcaseScrollableContainer.vue';
import { useApi } from '@/composables/useApi';
import type { PaginatedApiResponse } from '@/lib/types/common.type';
import { PAGINATION_UTILS } from '@/lib/types/data/pagination.data';
import { computed, onMounted, ref, watch } from 'vue';

const props = defineProps<{
  title?: string;
  link?: string;
  limit?: number;
  search?: string;
  page?: number;
  apiOptions: {
    endpoint: string;
  }
  mode?: 'showcase' | 'detail'
}>();

const emits = defineEmits<{
  artistCount: [count: {
    totalCount: number;
    currentCount: number;
    pages: number
    page: number
    hasNext: boolean;
    hasPrev: boolean;
    }]
}>()

const limit = computed(() => props.limit ?? PAGINATION_UTILS.itemsPerPage.default)
const search = computed(() => props.search ?? '');
const page = computed(() => props.page ?? 1)
const timer = ref<number | undefined>();

const { data, isLoading, isSuccess, execute, error, isError } = useApi<PaginatedApiResponse<T>>({
  dataFn: () => apiClient.get<PaginatedApiResponse<T>>({
    endpoint: props.apiOptions.endpoint,
    urlParams: {
      limit: limit.value.toString(),
      search: search.value,
      page: page.value.toString()
    }
  })
});

const responseData = computed(() => data.value as PaginatedApiResponse<T>);

onMounted(async () => {
  await execute();
  /**
   * only if being in a details page context
   * emit up the values required
   */
  if(props.mode === 'detail' && responseData.value) {
    handleEmitArtistCount()
  }
})

// watch query params to re-trigger api call
watch([limit, search, page], async() => {
  if(timer.value) {
    clearTimeout(timer.value)
  }
  timer.value = setTimeout(async () => {
    await execute()
    if(props.mode === 'detail' && responseData.value) {
      handleEmitArtistCount()
    }
  }, 500);

})

function handleEmitArtistCount() {
  emits('artistCount',{
      totalCount: responseData.value.totalCount,
      currentCount: responseData.value.currentItemsInPage,
      pages: responseData.value.pages,
      page: responseData.value.page,
      hasNext: responseData.value.hasNext,
      hasPrev: responseData.value.hasPrev
    })
}

</script>

<template>
  <section class="h-auto flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 v-if="props.title" class="text-2xl font-bold">
        {{ props.title || 'Title' }}
      </h2>

      <RouterLink v-if="props.link" class="hover:underline" :to="props.link">
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
      <div v-else-if="isSuccess && responseData.totalCount === 0">
        <p class="text-foreground">
          Empty
        </p>
      </div>
  </section>
</template>
