<script setup lang="ts">
import BaseGlassCard from '@/components/BaseGlassCard.vue';
import BaseImagePicker from '@/components/BaseImagePicker.vue';
import BaseTextArea from '@/components/ui/BaseTextArea.vue';
import Input from '@/components/ui/input/Input.vue';
import { useApi } from '@/composables/useApi';
import { songsService } from '@/features/songs/service/songs.service';
import type { PaginatedSongsResponse } from '@/lib/types/common.type';
import type { Song } from '@/lib/types/song/song.type';
import { Icon } from '@iconify/vue';
import { computed, onUnmounted, reactive, ref } from 'vue';

  const file = ref<File | null>(null)
  const search = ref<string>('');
  const isTypingSearch = ref<boolean>(false)
  const timer = ref<number | null>(null);
  const isInteracting = ref<boolean>(false);

  const playlistData = reactive<{
    name: string;
    description: string;
    songs: Array<{ _id: string, title: string, artist: string }>
    collaborators?: Array<string>
  }>({
    name: '',
    description: '',
    songs: [],
    collaborators: []
  })

  const { data, isSuccess, execute, isError, error } = useApi<PaginatedSongsResponse<Array<Song>>>({
    dataFn: async (config) => await songsService.getSongs(config)
  })

  const computedSongSearch = computed(() => data.value)

  function handleSelectFile(_file: File) {
    file.value = _file
  }

  function handleRemoveFile() {
    file.value = null
  }

  function handleDebouncedSearch(value: string) {
    if(timer.value) clearTimeout(timer.value)
    isTypingSearch.value = true
    isInteracting.value = true
    if(value.trim() === '') {
      isTypingSearch.value = false;
      isInteracting.value = false
      return;
    }
    timer.value = setTimeout(async () => {
      await execute({ urlParams: { search: value }})
      if(computedSongSearch.value) isTypingSearch.value = false
    }, 500);
  }

  /**
   * Handle add song
   * @param song
   */
  function handleAddSong(song: Song) {
    console.log(song, 'SONG');
    const selectedSong = { _id: song._id, artist: song.artist.name, title: song.title}
    // if song list is empty
    if(playlistData.songs.length === 0) {
      playlistData.songs.push(selectedSong);
      return
    }

    // check if song already exists in the list
    const songExists = playlistData.songs.find(_song => _song._id === song._id);

    if(songExists) return;

    // push song onto the list
    playlistData.songs.push(selectedSong);
  }

  /**
   * handle remove song from list
   * @param songId
   */
  function handleRemoveSong(songId: string) {
    // check if song exists
    const songExists = playlistData.songs.find(song => song._id === songId);
    if(!songExists) return;
    // filter out the selected song
    playlistData.songs = playlistData.songs.filter(item => item._id !== songId)
  }

  onUnmounted(() => {
    if(timer.value) clearTimeout(timer.value)
  })

</script>

<template>
  <section class="space-y-4 pb-44">
    <!-- title/info -->
    <div class="space-y-1">
      <h2 class="text-4xl font-bold">
        Create Playlist
      </h2>
      <p class="text-muted-foreground text-sm">
        Build your perfect collection
      </p>
    </div>
    <!-- playlist controllers -->
    <div class="flex gap-2">
      <!-- left -->
      <div class="space-y-4 min-w-[50%]">
        <BaseGlassCard class="grid grid-cols-3 gap-6">
          <BaseImagePicker
            @file-select="handleSelectFile"
            @file-unselect="handleRemoveFile"
          />
          <div class="w-full col-span-2 space-y-4">
            <Input
              placeholder="Playlist name"
              class="border-none"
              :modal-value="playlistData.name"
              @update="$event => playlistData.name = ($event as string)"
            />
            <BaseTextArea
              :model-value="playlistData.description"
              @update:model-value="$event => playlistData.description = ($event as string)"
              placeholder="description"
              class="border-none"
            />
          </div>
        </BaseGlassCard>
        <BaseGlassCard class="space-y-4">
          <div>
            <p class="flex items-center gap-2">
              <Icon class="text-primary" icon="lucide:music" width="24" height="24" />
              <span class="font-semibold">Add Songs</span>
            </p>
          </div>
          <div class="space-y-12 pb-8">
            <div class="group relative">
              <Input
                type="text"
                name="search"
                placeholder="Search for songs"
                class="peer"
                :modal-value="search"
                autocomplete="off"
                @update="$event => handleDebouncedSearch($event as string)"
              />
              <div class="absolute top-10 left-0 hidden opacity-0 h-[200px] overflow-y-auto w-full backdrop-blur-lg rounded-xl bg-card border border-white/10 peer-focus:z-20 peer-focus:opacity-100 peer-focus:flex justify-center pt-2 px-2">
                <div class="flex items-center justify-center" v-if="isTypingSearch">
                  <Icon class="animate-spin" icon="lucide:loader-circle" width="24" height="24" />
                </div>
                <div class="w-full" v-else>
                  <div class="w-full" v-if="isInteracting">
                    <div class="w-full space-y-4" v-if="isSuccess && computedSongSearch">
                      <div
                        class="cursor-pointer w-full transition-colors duration-300 p-2 rounded-xl hover:bg-secondary/50"
                        :key="song._id"
                        v-for="song in computedSongSearch.data"
                        @click="() => handleAddSong(song)"
                      >
                        <div class="flex items-center justify-between group/song">
                          <div class="flex items-center gap-4">
                            <div class="rounded bg-primary/20 p-2 w-fit">
                              <Icon class="text-accent" icon="lucide:music" width="24" height="24" />
                            </div>
                            <div>
                              <p>
                                {{ song.title }}
                              </p>
                              <p class="text-xs text-muted-foreground">
                                {{ song.artist.name }}
                              </p>
                            </div>
                          </div>
                          <Icon class="text-accent opacity-0 transition-opacity duration-300 group-hover/song:opacity-100" icon="mynaui:plus" width="24" height="24" />
                        </div>
                      </div>
                    </div>
                    <div v-if="isError && error">
                      <p class="text-red-500">
                        {{ error }}
                      </p>
                    </div>
                    <div v-if="isSuccess && computedSongSearch?.data.length === 0">
                      Oops No song found
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="flex items-center justify-center">
              <div class="flex flex-col items-center justify-center gap-2" v-if="playlistData.songs.length === 0">
                <Icon class="text-accent-foreground" icon="lucide:music" width="44" height="44" />
                <p class="text-accent-foreground">
                  Search and add songs to your playlist
                </p>
              </div>
              <div class="w-full space-y-2 z-30" v-else>
                <div class="bg-secondary/50 w-full transition-colors duration-300 p-4 rounded-xl group cursor-pointer" :key="song._id" v-for="song in playlistData.songs">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center gap-4">
                      <div class="rounded bg-primary/20 p-2 w-fit">
                        <Icon class="text-accent" icon="lucide:music" width="24" height="24" />
                      </div>
                      <div>
                        <p>
                          {{ song.title }}
                        </p>
                        <p class="text-xs text-muted-foreground">
                          {{ song.artist }}
                        </p>
                      </div>
                    </div>
                    <div @click="() => handleRemoveSong(song._id)" class="opacity-0 group-hover:bg-red-500/20 transition-opacity duration-300 group-hover:opacity-100 rounded-full h-8 w-8 flex items-center justify-center">
                      <Icon class="text-red-500/70" icon="maki:cross" width="15" height="15" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </BaseGlassCard>
      </div>
      <!-- right -->
       <BaseGlassCard class="flex-1">
        <p>Right section here</p>
      </BaseGlassCard>
    </div>
  </section>
</template>
