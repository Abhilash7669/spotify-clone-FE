<template>
  <div
    class="flex items-center gap-4 px-4 py-2 rounded-2xl bg-linear-to-r from-primary/10 via-secondary/60 to-primary/10 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5 animate-pulse"
  >
    <!-- Temp skeleton -->
    <div class="flex flex-col gap-1">
      <div class="w-10 h-4 skeleton"></div>
      <div class="w-14 h-2 skeleton"></div>
    </div>

    <!-- Divider -->
    <div class="h-8 w-px bg-border/50 hidden sm:block" />

    <!-- City skeleton -->
    <div class="hidden sm:flex flex-col gap-1">
      <div class="w-20 h-3 skeleton"></div>
      <div class="w-16 h-2 skeleton"></div>
    </div>

    <!-- Humidity skeleton -->
    <div class="hidden md:flex items-center gap-1.5">
      <div class="h-1.5 w-1.5 rounded-full skeleton"></div>
      <div class="w-24 h-2 skeleton"></div>
    </div>
  </div>
</template>
