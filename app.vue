<script setup lang="ts">
const config = ref<IConfigResizer>({
  isDraggable: false
})
const resizerRef = ref()
const selectedImageSrc = ref()

const handleSelectImage = (event: Event) => {
  console.log(event.target.files);
  if (!event.target.files) {
    config.value.image = undefined
    return
  }

  config.value.image = event.target.files[0]
}

const handleGetResizer = () => {
  selectedImageSrc.value = resizerRef.value.getImageResized()
}
</script>

<template>
  <input type="file" @change="handleSelectImage">
  <button @click="handleGetResizer">Get image</button>
  <Resizer 
    ref="resizerRef"
    :config
    style="border: 1px solid gray;border-radius: 8px;"
    @resizer-change="handleGetResizer"
  />
  <img :src="selectedImageSrc" style="width: 300px;height: 300px;object-fit: cover;">
</template>
