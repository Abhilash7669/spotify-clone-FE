<script setup lang="ts">
import BaseSidebarNavMenu from '@/components/common/sidebar/BaseSidebarNavMenu.vue'
import type { NavList } from '@/lib/types/nav/nav.type'
import { ref } from 'vue'

const navItems = ref<NavList>([
  {
    value: '/auth/home',
    label: 'Home',
    icon: 'lucide-lab:home',
  },
  {
    value: '/auth/search',
    label: 'Search',
    icon: 'lucide:search',
  },
  {
    value: '/auth/library',
    label: 'Your Library',
    icon: 'lucide:library',
  },
])

const navItemsB = ref<NavList>([
  {
    value: '/auth/create-playlist',
    label: 'Create Playlist',
    icon: 'lucide:plus',
  },
  {
    value: '/auth/liked-songs',
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
