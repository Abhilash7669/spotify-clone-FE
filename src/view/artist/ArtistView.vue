<script setup lang="ts">
import { useRoute } from 'vue-router';


const route = useRoute();
// const selectedSong = ref<string | undefined>()


// const playerStore = usePlayerStore();

// const { data, isLoading, error, isError, execute, isSuccess} = useApi({
//   dataFn: (config) => apiClient.get({
//     endpoint: `/artists/${route.params.id}`,
//     ...config
//   })
// });
// const artistData = computed(() => data.value);

// onMounted(async() => {
//   await execute();
//   if(isSuccess) console.log(artistData.value, "DAA=TA")
// })

// function handleSelectSong(data: {audioURL: string, title: string; coverImage: string }) {
//   playerStore.audioURL = data.audioURL
//   playerStore.title = data.title
//   playerStore.coverImage = data.coverImage
// }


</script>

<template>
  <p class="mb-12">
    {{ route.params.id }}
  </p>
  <!-- <div class="space-y-4" v-if="isSuccess && artistData">
    <p>Artist Name: {{ artistData.data.name }}</p>
    <p>
      Songs Listed down here
    </p>
    <ul>
      <li class="border border-accent w-fit rounded-md p-2 cursor-pointer" @click="() => handleSelectSong({
        audioURL: song.audioURL,
        coverImage: song.coverImage,
        title: song.title
      })" v-for="song in artistData.data.songs">
        {{ song.title }}
      </li>
    </ul>
  </div> -->
</template>
