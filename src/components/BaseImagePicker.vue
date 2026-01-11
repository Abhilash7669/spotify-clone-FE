<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref, useTemplateRef } from 'vue';


  const emits = defineEmits<{
    (event: 'fileSelect', value: File): void
    (event: 'fileUnselect'): void
  }>()

  const previewUrl = ref<string | null>(null)
  const inputRef = useTemplateRef('input-ref');

function handleFile(e: InputEvent) {
  const inputElement = (e.target as HTMLInputElement)
  if(inputElement.files && inputElement.files[0]) {

    const _file = inputElement.files[0]

    const urlObject = URL.createObjectURL(_file);

    previewUrl.value = urlObject

    emits('fileSelect', _file)

  }
}

function handleRemoveFile() {
  previewUrl.value = null
  emits('fileUnselect')
}

function handleInputClick() {
  inputRef.value?.click()
}

</script>

<template>
  <div>
    <input
      type="file"
      @input="$event => handleFile($event)"
      class="hidden"
      ref="input-ref"
    />
    <div
      @click="handleInputClick"
      v-if="!previewUrl"
      class="w-40 h-40 shrink-0 rounded-xl bg-linear-to-br from-primary/30 to-primary/10 border border-white/10 flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-colors"
    >
      <Icon icon="lucide:image-down" width="34" height="34" />
    </div>
    <div v-else class="w-40 h-40 shrink-0 rounded-xl relative group overflow-hidden">
      <img
        :src="previewUrl"
        class="h-full w-full object-cover"
      />
      <div class="opacity-0 absolute top-0 left-0 h-full flex items-center justify-center w-full bg-black/20 z-10 transition-opacity duration-300 group-hover:opacity-100">
        <div class="flex items-center gap-2">
          <div class="p-2.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors">
            <Icon @click="handleInputClick" icon="lucide:refresh-ccw" width="24" height="24" />
          </div>
          <div class="p-2.5 rounded-full bg-white/20 hover:bg-white/30 cursor-pointer transition-colors">
            <Icon @click="handleRemoveFile" icon="lucide:trash-2" width="24" height="24" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
