<script setup lang="ts">
import BaseArtistCard from '@/components/cards/BaseArtistCard.vue';
import ShowcaseTemplate from '@/components/template/ShowcaseTemplate.vue';
</script>

<template>
  <!-- @vue-generic {import('@/lib/types/artist.type').ArtistsShowcase} -->
 <ShowcaseTemplate
  :api-options="{ endpoint: '/artists'}"
  link=""
  title="Popular Artists"
  v-slot="{ items }"
 >
  <BaseArtistCard
    v-for="artist in items"
    :key="artist._id"
    :artist-card-data="artist"
  />
  </ShowcaseTemplate>
</template>
