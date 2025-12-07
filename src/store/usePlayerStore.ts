import { defineStore } from "pinia";

export const usePlayerStore = defineStore('player', {
  state: () => {
    return {
      audioURL: "",
      title: "",
      coverImage: "",
      artistName: ""
    }
  },
})
