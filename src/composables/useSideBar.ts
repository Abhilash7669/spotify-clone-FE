import { computed, ref } from 'vue'

const DEFAULT_OPEN_STATE: boolean = false
const isSideBarOpen = ref<boolean>(DEFAULT_OPEN_STATE)

export function useSideBar() {
  const DEFAULT_WIDTH: number = 250
  const CLOSED_WIDTH: number = 50

  const sideBarWidth = computed(() => {
    if (isSideBarOpen.value) {
      return DEFAULT_WIDTH
    } else {
      return CLOSED_WIDTH
    }
  })

  const toggleSideBar = () => (isSideBarOpen.value = !isSideBarOpen.value)

  return {
    toggleSideBar,
    sideBarWidth,
    isSideBarOpen,
  }
}
