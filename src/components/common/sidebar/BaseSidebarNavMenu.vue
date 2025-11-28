<script setup lang="ts">
import { useSideBar } from '@/composables/useSideBar'
import type { NavList } from '@/lib/types/nav/nav.type'
import { cn } from '@/utils/cn'
import { Icon } from '@iconify/vue'
import type { HTMLAttributes } from 'vue'

const props = defineProps<{
  navItems: NavList
  class?: HTMLAttributes['class']
}>()

const { isSideBarOpen } = useSideBar()
</script>

<template>
  <ul :class="`${isSideBarOpen ? 'space-y-2' : 'space-y-4'} px-2`">
    <li
      v-for="(item, i) in props.navItems"
      :key="item.value"
      :style="{ animationDelay: `${i * 0.1}s` }"
      class="opacity-0 animate-fade-slide-in"
    >
      <router-link
        :class="
          cn(
            `flex whitespace-nowrap items-center rounded-xl hover:text-foreground transition-all duration-500
                ${isSideBarOpen ? 'px-3 py-2 gap-4 text-sidebar-foreground' : 'px-0 py-0 gap-0'}
              `,
            props.class,
          )
        "
        :active-class="`${isSideBarOpen ? 'text-foreground bg-sidebar-accent !text-foreground' : ''}`"
        :to="`${item.value}`"
      >
        <Icon
          v-if="item.icon && item.icon.trim() !== ''"
          :class="`cursor-pointer h-5 w-5 z-10 transition-all duration-300 ${item.color ? item.color : ''}`"
          :icon="item.icon"
        />
        <p
          :class="`font-medium flex whitespace-nowrap overflow-hidden transition-all duration-300 ${!isSideBarOpen ? 'animate-fade-out w-0' : 'animate-fade-in w-4/5'}`"
        >
          {{ item.label }}
        </p>
      </router-link>
    </li>
  </ul>
</template>
