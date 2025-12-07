<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import { Icon } from '@iconify/vue';
import { computed, onMounted, ref } from 'vue';

const isDarkMode = ref<boolean>(false);

const toggleTheme = computed(() => isDarkMode.value);

onMounted(() => {

  const localStorageThemeToken = localStorage.getItem("spotify-theme");

  if(localStorageThemeToken && localStorageThemeToken === "dark") {
    isDarkMode.value = true;
    handleSetTheme(true);
  }

  if(localStorageThemeToken && localStorageThemeToken === "light") {
    isDarkMode.value = false
    handleSetTheme(false);
  }

})

function handleToggleTheme() {

  isDarkMode.value = !isDarkMode.value;
  const body = document.querySelector('body');
  if(toggleTheme.value) {
    body?.classList.add("dark")
    localStorage.setItem("spotify-theme", "dark")
  } else {
    localStorage.setItem("spotify-theme", "light")
    body?.classList.remove("dark");
  }

}
function handleSetTheme(isDark: boolean) {
  const body = document.querySelector('body');

  if(isDark) {
    body?.classList.add("dark")
  } else {
    body?.classList.remove("dark");
  }

}

</script>

<template>
  <Button @click="handleToggleTheme" variants="outline">
    <Icon v-if="isDarkMode" icon="lucide:moon" />
    <Icon v-else icon="lucide:sun" />
  </Button>
</template>
