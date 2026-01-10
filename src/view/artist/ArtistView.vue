<script setup lang="ts">
import BaseAvatar from '@/components/common/avatar/BaseAvatar.vue';
import Button from '@/components/ui/button/Button.vue';
import ButtonGlow from '@/components/ui/button/ButtonGlow.vue';
import { useApi } from '@/composables/useApi';
import ArtistSongsListing from '@/features/artist/components/ArtistSongsListing.vue';
import BaseArtistDetailsSkeleton from '@/features/artist/components/skeleton/BaseArtistDetailsSkeleton.vue';
import { ARTIST_DETAILS_TABS, type detailsTabsValue } from '@/features/artist/components/skeleton/data/tabs';
import { artistService } from '@/features/artist/service/index.service';
import type { FollowToggleDto, GetArtistDetailsDto, LocalArtistData } from '@/features/artist/types/artist.types';
import type { SelectedSong } from '@/lib/types/player.type';
import type { Song } from '@/lib/types/song/song.type';
import { usePlayerStore } from '@/store/usePlayerStore';
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';


const route = useRoute();

const playerStore = usePlayerStore();
/**
 * Local state controllers
 * follower
 */
const isUserFollowing = ref<boolean>(false);
const followers = ref<number>(0);
const activeTab = ref<detailsTabsValue>('popular');

/**
 * fetch artist data
 */
const {
  data,
  isLoading,
  execute,
  isSuccess
} = useApi<GetArtistDetailsDto>({
  dataFn: async (config) => (
    await artistService.getArtist(route.params.id as string, config)
  )
});

/**
 * Handle Follow artist api call
 */
const {
  execute: executeFollowArtist,
  isLoading: isFollowArtistLoading,
  data: isFollowArtistRes
} = useApi<{ data: FollowToggleDto}>({
  dataFn: async () =>  (
    isUserFollowing.value ?
      await artistService.unfollowArtist(route.params.id as string)
      :
      await artistService.followArtist(route.params.id as string)
  )
})

/**
 * Computed artist data
 */
const artistData = computed(() => data.value);

onMounted(async() => {
  await execute();
  if(artistData.value && artistData.value.data) {
    setInitialLocalData({
      followers: artistData.value.data.followers,
      isFollowing: artistData.value.data.isFollowing
    });
  }
})


/**
 * handles follow artist
 */
async function handleFollowArtist() {
  await executeFollowArtist()
  if(isFollowArtistRes.value?.data) {
    setUpdatedFollowStatus(isFollowArtistRes.value.data.isFollowing)
  }
}

/**
 * Updates front-end follow status and follower count
 */
function setUpdatedFollowStatus(isFollowing: boolean) {
  isUserFollowing.value = isFollowing;
  followers.value = isFollowing ? followers.value + 1 : followers.value - 1
}

/**
 * Sets the initial required local data
 * @param data
 */
function setInitialLocalData(data: LocalArtistData) {
  isUserFollowing.value = data.isFollowing
  followers.value = data.followers
}

/**
 * handle toggling tab
 * @param value
 */
function handleActiveTab(value: detailsTabsValue) {
  activeTab.value = value
}

/**
 * Plays all songs in the current displayed list
 */
function handlePlayAllSongs() {
  if(!artistData.value?.data && !artistData.value?.data.songs) return
  /**
   * transform data
   */
  const bulkSong = artistData.value.data.songs.map(song => {
    return {
      audioURL: song.audioURL,
      title: song.title,
      coverImage: song.coverImage,
      artistName: artistData!.value!.data.name,
      id: song._id
    }
  })
  playerStore.handleInsertBulkSongs(bulkSong)
}

/**
 * Insert single song from the list
 */
  function handlePlaySingleSong(song: Song) {
    const selectedSong: SelectedSong = {
      artistName: artistData!.value!.data.name,
      audioURL: song.audioURL,
      coverImage: song.coverImage,
      id: song._id,
      title: song.title
    }
    playerStore.handleInsertSingleSong(selectedSong)
  }


</script>

<template>

  <!-- initial loading state -->
  <div v-if="isLoading && !artistData">
    <BaseArtistDetailsSkeleton />
  </div>

  <!-- success -->
  <div class="space-y-4" v-if="isSuccess && artistData">
    <!-- header -->
    <div class="relative">
      <!-- {/* Gradient Background */} -->
      <div class="absolute inset-0 bg-linear-to-b from-primary/30 via-primary/10 to-background" />

      <div class="relative px-4 pt-6 pb-8">
        <div class="flex flex-col md:flex-row items-center md:items-end gap-6 animate-fade-in">
          <BaseAvatar
            class="h-48 w-48 md:h-56 md:w-56 shadow-2xl ring-4 ring-background/20"
            :src="artistData.data.image"
          />

          <div class="text-center md:text-left space-y-2">
            <span class="inline-flex items-center gap-1.5 text-sm font-medium">
              <span class="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <span class="text-[10px] text-primary-foreground">✓</span>
              </span>
              Verified Artist
            </span>
            <h1 class="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight">
              {{ artistData.data.name }}
            </h1>
            <div class="flex flex-wrap items-center justify-center md:justify-start gap-4 text-subdued">
              <span class="hidden sm:inline">{{ followers }} followers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- info -->
    <div class="px-6 space-y-6">
      <!-- actions -->
      <div class="flex items-center gap-4">
        <!-- Play All button -->
        <ButtonGlow @click="handlePlayAllSongs" class="h-14 w-14 rounded-full">
          <Icon icon="lucide:play" width="24" height="24" />
        </ButtonGlow>
        <Button @disable="isFollowArtistLoading" @click="handleFollowArtist" variants="outline" class="rounded-full py-6 px-8 border-foreground/30 hover:border-foreground hover:bg-transparent">
          <span v-if="isFollowArtistLoading">
            <Icon class="animate-spin" icon="lucide:loader-circle" width="24" height="24" />
          </span>
          <div v-else>
            <span v-if="isUserFollowing">Following</span>
            <span v-else>Follow</span>
          </div>
        </Button>
      </div>
      <!-- control bar -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span>
            <Icon class="text-primary" icon="lucide:music-2" width="22" height="22" />
          </span>
          <p class="text-2xl font-bold">
            Songs
          </p>
        </div>
        <div class="flex items-center gap-2">
          <!-- tab container -->
           <div class="flex items-center gap-1 p-2 bg-card/30 rounded-xl backdrop-blur-sm border border-border/20">
             <div v-for="tab in ARTIST_DETAILS_TABS" :key="tab.value">
               <Button
                @click="() => handleActiveTab(tab.value)"
                :class="`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 bg-transparent ${activeTab !== tab.value ? 'hover:text-foreground hover:bg-card/50' : 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'}`"
              >
                 <Icon :icon="tab.icon" height="24" width="24" />
                 <p>
                   {{ tab.label }}
                 </p>
               </Button>
             </div>
           </div>
        </div>
      </div>
    </div>

    <!-- tab-based-rendered-items -->

    <!-- tab-popular -->
    <div v-if="activeTab === 'popular'">
      <div class="flex items-center gap-2 px-6">
        <Icon class="text-primary" icon="lucide:trending-up" height="16" width="16" />
        <p>
          Top tracks based on popularity
        </p>
      </div>
      <ul class="w-full">
        <ArtistSongsListing
          v-for="(song, i) in artistData.data.songs"
          :key="i"
          :i="i"
          :song="song"
          @handle-play-song="handlePlaySingleSong"
        />
      </ul>
    </div>

    <!-- about -->
     <section class="px-6 mt-12">
      <h2 class="text-2xl font-bold mb-4">
        About
      </h2>
      <div class="rounded-2xl border border-border/30 p-4 bg-linear-to-br from-card/50 to-card/20">
        <div class="flex items-start gap-2 h-full">
          <BaseAvatar
            class="h-32 w-32 rounded-lg"
            :src="artistData.data.image"
          />
          <div class="flex flex-col gap-2">
            <p class="text-subdued leading-relaxed">
              {{ artistData.data.bio }}
            </p>
            <div class="flex items-center gap-2">
              <!-- followers -->
               <p class="font-bold text-lg">
                {{ followers }} followers
               </p>
               <!-- genres -->
               <div class="flex items-center gap-2 rounded-full px-3 py-1.5 bg-primary/20 text-sm font-medium text-primary">
                <div v-for="genre in artistData.data.genres" :key="genre">
                  <span v-if="artistData.data.genres.length > 1">{{ genre }}</span>
                  <span v-else>{{ genre }}</span>
                </div>
               </div>
            </div>
          </div>
        </div>
      </div>
     </section>
  </div>
</template>
