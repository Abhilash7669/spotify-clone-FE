<script setup lang="ts">
import BaseSongCard from '@/components/cards/BaseSongCard.vue';
import ShowcaseTemplate from '@/components/template/ShowcaseTemplate.vue';

</script>

<template>
  <!-- @vue-generic {import('@/lib/types/song/song.type').SongsShowcase} -->
<ShowcaseTemplate
  title="Popular Songs"
  link=""
  :api-options="{ endpoint: '/songs' }"
  v-slot="{ items }"
>
  <BaseSongCard
    v-for="song in items"
    :key="song._id"
    :card-data="song"
  />
</ShowcaseTemplate>
</template>
