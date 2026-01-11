<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { PAGINATION_UTILS } from '@/lib/types/data/pagination.data';


const props = defineProps<{
  limit: number;
  page: number;
  pages: number;
  hasPrev: boolean;
  hasNext: boolean;
}>()

const emits = defineEmits<{
  (event: 'limitSelect', value: number): void;
  (event: 'prevClick'): void
  (event: 'nextClick'): void
}>()

</script>

<template>
  <div
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
              v-on:change="$event => emits('limitSelect', Number(($event.target as HTMLSelectElement).value))"
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
              Page {{ props.page }} of {{ props.pages }}
            </p>
            <div class="border border-border w-px h-6" />
          </div>
          <div class="space-x-2">
            <Button class="active:scale-95" variants="secondary" :disabled="!props.hasPrev" @click="emits('prevClick')">
              Prev
            </Button>
            <Button class="active:scale-95" variants="secondary" :disabled="!hasNext" @click="emits('nextClick')">
              Next
            </Button>
          </div>
        </div>
     </div>
</template>
