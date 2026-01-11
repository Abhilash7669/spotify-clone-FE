<script setup lang="ts">
import BaseSidebarNavMenu from '@/components/common/sidebar/BaseSidebarNavMenu.vue'
import type { NavList } from '@/lib/types/nav/nav.type'
import { ref } from 'vue'

const navItems = ref<NavList>([
  {
    value: '/protected/home',
    label: 'Home',
    icon: 'lucide-lab:home',
  },
  {
    value: '/protected/songs',
    label: 'Songs',
    icon: 'lucide:music-2',
  },
  // {
  //   value: '/protected/library',
  //   label: 'Your Library',
  //   icon: 'lucide:library',
  // },
  {
    value: '/protected/artist',
    label: 'Artists',
    icon: 'ion:people-outline',
  },
])

const navItemsB = ref<NavList>([
  {
    value: '/protected/create-playlist',
    label: 'Create Playlist',
    icon: 'lucide:plus',
  },
  {
    value: '/protected/liked-songs',
    label: 'Liked Songs',
    icon: 'heroicons:heart-solid',
    color: 'text-primary',
  },
])
</script>

<template>
  <div class="space-y-4">
    <BaseSidebarNavMenu :nav-items="navItems" />
    <div class="border w-full h-px" />
    <BaseSidebarNavMenu :nav-items="navItemsB" />
  </div>
</template>
