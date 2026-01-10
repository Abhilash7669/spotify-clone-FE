<script setup lang="ts">
import { apiClient } from '@/api/api';
import BaseWeatherSkeleton from '@/components/common/skeleton/BaseWeatherSkeleton.vue';
import { useApi } from '@/composables/useApi';
import { VUE_CONFIG } from '@/config/config';
import type { CurrentWeather } from '@/lib/types/external/weather.type';
import { computed, onMounted } from 'vue';


const { data, error, execute, isError, isLoading, isSuccess } = useApi<{ data: CurrentWeather}>({
  dataFn: () => apiClient.get<{ data: CurrentWeather}>({
    endpoint: '/weather/current',
    urlParams: {
      key: VUE_CONFIG.WEATHER_API_KEY
    }
  })
});

const weatherData = computed(() => data.value);

onMounted(async() => {
  await execute();
})


</script>

<template>
  <!-- Initial loading state -->
  <div v-if="isLoading && !weatherData">
    <BaseWeatherSkeleton />
  </div>
  <!-- Success -->
  <div v-if="isSuccess && weatherData" class="flex items-center gap-4 px-4 py-2 rounded-2xl bg-linear-to-r from-primary/10 via-secondary/60 to-primary/10 backdrop-blur-md border border-primary/20 shadow-lg shadow-primary/5">
    <div class="flex flex-col">
      <span class="text-lg font-bold text-foreground leading-tight">{{ weatherData?.data.current.temp_c }}°C</span>
      <span class="text-[10px] text-muted-foreground leading-tight">{{ weatherData?.data.current.condition.text }}</span>
    </div>

    <div class="h-8 w-px bg-border/50 hidden sm:block" />

    <div class="hidden sm:flex flex-col">
      <span class="text-sm font-semibold text-foreground leading-tight">{{ weatherData?.data.location.name }}</span>
      <span class="text-[10px] text-muted-foreground leading-tight">{{ weatherData?.data.location.country }}</span>
    </div>

    <div class="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
      <div class="h-1.5 w-1.5 rounded-full bg-primary/60" />
      <span>{{ weatherData?.data.current.humidity }}% humidity</span>
    </div>
  </div>
  <!-- Error -->
  <p class="text-sm text-red-500" v-if="isError && error">
    {{ error }}
  </p>
</template>
