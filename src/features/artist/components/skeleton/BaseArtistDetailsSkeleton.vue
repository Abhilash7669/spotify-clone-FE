<script setup lang="ts">
import BaseSkeleton from '@/components/common/skeleton/BaseSkeleton.vue'
import BaseAlbumSkeleton from '@/features/artist/components/skeleton/BaseAlbumSkeleton.vue';
import BaseSongRowSkeleton from '@/features/artist/components/skeleton/BaseSongRowSkeleton.vue'
</script>

<template>
  <div class="min-h-screen pb-32 animate-pulse">
    <!-- Hero Section Skeleton -->
    <div class="relative">
      <!-- Gradient Background -->
      <div
        class="absolute inset-0 bg-linear-to-b from-primary/20 via-primary/5 to-background"
      />

      <div class="relative px-6 pt-6 pb-8">
        <!-- Back Button Skeleton -->
        <BaseSkeleton class="h-10 w-10 rounded-full mb-6" />

        <!-- Artist Info Skeleton -->
        <div
          class="flex flex-col md:flex-row items-center md:items-end gap-6"
        >
          <!-- Avatar Skeleton -->
          <BaseSkeleton
            class="h-48 w-48 md:h-56 md:w-56 rounded-full ring-4 ring-background/20 shadow-2xl"
          />

          <div
            class="text-center md:text-left space-y-4 flex-1"
          >
            <!-- Verified Badge -->
            <div
              class="flex items-center justify-center md:justify-start gap-2"
            >
              <BaseSkeleton class="h-5 w-5 rounded-full" />
              <BaseSkeleton class="h-4 w-24" />
            </div>

            <!-- Artist Name -->
            <BaseSkeleton
              class="h-12 md:h-16 lg:h-20 w-64 md:w-80 lg:w-96 mx-auto md:mx-0"
            />

            <!-- Stats -->
            <div
              class="flex items-center justify-center md:justify-start gap-4"
            >
              <BaseSkeleton class="h-4 w-40" />
              <BaseSkeleton
                class="h-4 w-28 hidden sm:block"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Actions Skeleton -->
    <div class="px-6 py-6 flex items-center gap-4">
      <BaseSkeleton class="h-14 w-14 rounded-full" />
      <BaseSkeleton class="h-10 w-28 rounded-full" />
      <BaseSkeleton class="h-10 w-10 rounded-full" />
      <BaseSkeleton class="h-10 w-10 rounded-full" />
    </div>

    <!-- Songs Section Skeleton -->
    <section class="px-6">
      <!-- Tab Header -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
      >
        <div class="flex items-center gap-2">
          <BaseSkeleton class="h-5 w-5" />
          <BaseSkeleton class="h-7 w-20" />
        </div>

        <!-- Tab Navigation Skeleton -->
        <div
          class="flex items-center gap-1 p-1 bg-card/30 rounded-xl"
        >
          <BaseSkeleton class="h-9 w-24 rounded-lg" />
          <BaseSkeleton class="h-9 w-32 rounded-lg" />
          <BaseSkeleton class="h-9 w-28 rounded-lg" />
        </div>
      </div>

      <!-- Tab Content Indicator -->
      <div class="flex items-center gap-2 mb-4">
        <BaseSkeleton class="h-4 w-4" />
        <BaseSkeleton class="h-4 w-48" />
      </div>

      <!-- Songs List Skeleton -->
      <div class="space-y-1">
        <BaseSongRowSkeleton
          v-for="i in 5"
          :key="i"
        />
      </div>

      <!-- See All Button Skeleton -->
      <BaseSkeleton class="h-9 w-36 mt-4" />
    </section>

    <!-- Discography Skeleton -->
    <section class="px-6 mt-12">
      <div class="flex items-center gap-2 mb-6">
        <BaseSkeleton class="h-5 w-5" />
        <BaseSkeleton class="h-7 w-32" />
      </div>

      <div
        class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
      >
        <BaseAlbumSkeleton
          v-for="i in 5"
          :key="i"
        />
      </div>
    </section>

    <!-- About Section Skeleton -->
    <section class="px-6 mt-12">
      <BaseSkeleton class="h-7 w-20 mb-4" />

      <div
        class="rounded-2xl bg-linear-to-br from-card/50 to-card/20 p-6 border border-border/30"
      >
        <div class="flex flex-col md:flex-row gap-6">
          <BaseSkeleton
            class="h-32 w-32 rounded-xl shrink-0"
          />

          <div class="space-y-4 flex-1">
            <div class="space-y-2">
              <BaseSkeleton class="h-4 w-full" />
              <BaseSkeleton class="h-4 w-full" />
              <BaseSkeleton class="h-4 w-3/4" />
            </div>

            <div class="flex items-center gap-4">
              <div class="flex flex-col gap-1">
                <BaseSkeleton class="h-5 w-24" />
                <BaseSkeleton class="h-3 w-20" />
              </div>

              <BaseSkeleton class="h-8 w-px" />

              <div class="flex flex-col gap-1">
                <BaseSkeleton class="h-5 w-20" />
                <BaseSkeleton class="h-3 w-16" />
              </div>

              <BaseSkeleton class="h-8 w-px" />
              <BaseSkeleton class="h-7 w-20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
