<script setup lang="ts">
import BaseArtistCard from '@/components/cards/BaseArtistCard.vue';
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue';
import ShowcaseTemplate from '@/components/template/ShowcaseTemplate.vue';
import Button from '@/components/ui/button/Button.vue';
import Input from '@/components/ui/input/Input.vue';
import { PAGINATION_UTILS } from '@/lib/types/data/pagination.data';
import { Icon } from '@iconify/vue';
import { computed, onUnmounted, ref } from 'vue';

/**
 * query params refs
 */
const limit = ref<number>(PAGINATION_UTILS.itemsPerPage.default);
const search = ref<string>('');
const pages = ref<number | undefined>(undefined)
const page = ref<number | undefined>(PAGINATION_UTILS.page.default)
const hasNext = ref<boolean>(false)
const hasPrev = ref<boolean>(false)

const hasPagination = computed(() => totalArtist.value && totalArtist.value > 10)

const totalArtist = ref<number | undefined>(undefined)
const currentPageArtistsCount = ref<number | undefined>(undefined)

const timer = ref<number | undefined>(undefined)

function getArtistPageMeta(artistCount: { totalCount: number, currentCount: number, pages: number, page: number, hasNext: boolean, hasPrev: boolean}) {
  totalArtist.value = artistCount.totalCount
  currentPageArtistsCount.value = artistCount.currentCount
  pages.value = artistCount.pages
  page.value = artistCount.page
  hasNext.value = artistCount.hasNext
  hasPrev.value = artistCount.hasPrev
}

function handleDebouncedSearch(artistName: string) {

  if(timer.value) clearTimeout(timer.value)

  timer.value = setTimeout(() => {
    search.value = artistName
  }, 400);

}

function handleClearSearch() {
  search.value = ''
}
function handleChangeLimit(value: number) {
  console.log(value, 'VALUE')
  limit.value = value;
  page.value = PAGINATION_UTILS.page.default;
}

function handleNext() {
  if(hasNext.value && page.value) {
    page.value +=1
  }
}

function handlePrev() {
  if(hasPrev.value && page.value && page.value !== 1) {
    page.value--
  }
}

// handling timer cleanup
onUnmounted(() => {
  if(timer.value) clearTimeout(timer.value)
})


</script>
<template>
  <section class="p-6">
    <div class="space-y-2">
      <h2 class="text-4xl font-bold">
        All Artists
      </h2>
      <!-- artist count -->
      <p>
        <span v-if="totalArtist">
          {{ totalArtist }} artists total
        </span>
        <span v-if="totalArtist === 0">
          No artists found
        </span>
        <BaseSkeleton
          v-if="totalArtist === undefined"
          class="w-32 h-6"
        />
      </p>
    </div>
    <!-- input control -->
    <div class="flex items-center gap-2 mt-6 w-full">
      <Input
        :modal-value="search"
        @update="($event) => handleDebouncedSearch($event as string)"
        placeholder="Search artist"
        class="w-56 caret-amber-400"
        id="search"
      />
      <Button variants="secondary" @click="handleClearSearch" v-if="search">
        Clear
      </Button>
    </div>
    <!-- @vue-generic {import('@/lib/types/artist.type').ArtistsShowcase} -->
   <ShowcaseTemplate
    :api-options="{ endpoint: '/artists'}"
    v-slot="{ items }"
    :limit="limit"
    :search="search"
    :page="page"
    mode="detail"
    @artist-count="getArtistPageMeta"
   >
    <BaseArtistCard
      v-for="artist in items"
      :key="artist._id"
      :artist-card-data="artist"
    />
    </ShowcaseTemplate>
    <!-- pagination control -->
     <div v-if="hasPagination"
        class="fixed z-20 bottom-26 p-4 left-2/4 -translate-x-2/4 rounded-3xl backdrop-blur-lg bg-secondary/30 w-auto flex items-center justify-between min-w-lg"
      >
        <div class="w-fit relative">
           <select
              class="bg-background/50 text-sm font-semibold text-foreground appearance-none
                  px-4 py-2 rounded-lg border border-border
                  shadow-sm hover:shadow-md
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  transition"
              name="itemsPerPage"
              id="itemsPerPage"
              :value="limit"
              v-on:change="$event => handleChangeLimit(Number(($event.target as HTMLSelectElement).value))"
            >
              <option
                v-for="value in PAGINATION_UTILS.itemsPerPage.items"
                :key="value"
                :value="value"
              >
                {{ value }}
              </option>
            </select>
            <Icon class="absolute top-2/4 -translate-y-2/4 right-1" icon="lucide:chevron-down" height="12" width="12" />
        </div>
        <!-- controls -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-2">
            <p class="text-sm text-muted-foreground">
              Page {{ page }} of {{ pages }}
            </p>
            <div class="border border-border w-px h-6" />
          </div>
          <div class="space-x-2">
            <Button class="active:scale-95" variants="secondary" :disabled="!hasPrev" @click="handlePrev">
              Prev
            </Button>
            <Button class="active:scale-95" variants="secondary" :disabled="!hasNext" @click="handleNext">
              Next
            </Button>
          </div>
        </div>
     </div>
  </section>
</template>
