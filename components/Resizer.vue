<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    config?: IConfigResizer
  }>(), 
  {
    config: {
      type:  'image/png',
      quality: 1
    }
  }
)

const emit = defineEmits<{
  'resizer-change': []
}>()

const { 
  drawImage,
  getImageResized,
  loadedImage
} = useImage(props.config)

const { 
  getHandleAt,
  getHandles,
  isResizing
} = useResize()

const canvasRef = useTemplateRef('canvasRef')
const rect = ref<IRectangle>()

const isDragging = ref(false)
const isCreating = ref(false)
const dragOffsetX = ref(0)
const dragOffsetY = ref(0)

// Contenu de l'image sélectionné
const newImageSelected = ref<ImageData>()

const init = () => {
  if (!props?.config?.image) return

  const img = new Image()
  img.src = URL.createObjectURL(props.config.image)
  img.onload = () => {
    loadedImage.value = img
    drawCanvas()
  }
}

/**
 * Dessine l'image et la zone de sélection
 */
const drawCanvas = () => {
  const ctx = canvasRef.value?.getContext('2d')
  if (!ctx) return

  // Réinitialisation du canvas
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Affichage de l'image
  drawImage(ctx)

  if(rect.value && rect.value.w && rect.value.h && loadedImage.value) {
    // Récupération de la partie sélectionné
    newImageSelected.value = ctx.getImageData(rect.value.x, rect.value.y, rect.value.w, rect.value.h)
  }

  if (rect.value) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)'
    ctx.fillRect(rect.value.x, rect.value.y, rect.value.w, rect.value.h)

    // Points de redimensionnement
    ctx.fillStyle = '#fff'
    getHandles(rect.value).forEach(h => {
      ctx.fillRect(h.x - HANDLE_SIZE / 2, h.y - HANDLE_SIZE / 2, HANDLE_SIZE, HANDLE_SIZE)
    })
  }

  emit('resizer-change')
}

/**
 * Correction des points de la zone de la sélection pour les contenir dans l'élément Canvas
 */
const clampRect = () => {
  if (!rect.value) return
  if (rect.value.x < 0) rect.value.x = 0
  if (rect.value.y < 0) rect.value.y = 0
  if (rect.value.x + rect.value.w > WIDTH) rect.value.x = WIDTH - rect.value.w
  if (rect.value.y + rect.value.h > HEIGHT) rect.value.y = HEIGHT - rect.value.h
}

const handleMouseDown = (event: MouseEvent) => {
  const mouseX = event.offsetX
  const mouseY = event.offsetY

  const handle = getHandleAt(rect.value, mouseX, mouseY)
  if (handle) {
    isResizing.value = handle
    return
  }

  if (
    rect.value &&
    mouseX >= rect.value.x &&
    mouseX <= rect.value.x + rect.value.w &&
    mouseY >= rect.value.y &&
    mouseY <= rect.value.y + rect.value.h
  ) {
    isDragging.value = true
    dragOffsetX.value = mouseX - rect.value.x
    dragOffsetY.value = mouseY - rect.value.y
    return
  }

  isCreating.value = true
  rect.value = { x: mouseX, y: mouseY, w: 0, h: 0 }
}

const handleMouseMove = (event: MouseEvent) => {
  if (!rect.value) return

  const mouseX = event.offsetX
  const mouseY = event.offsetY

  if (isResizing.value) {
    switch (isResizing.value) {
      case ResizeHandleEnum.TOP_LEFT:
        rect.value.w += rect.value.x - mouseX
        rect.value.h += rect.value.y - mouseY
        rect.value.x = mouseX
        rect.value.y = mouseY
        break
      case ResizeHandleEnum.TOP_RIGHT:
        rect.value.w = mouseX - rect.value.x
        rect.value.h += rect.value.y - mouseY
        rect.value.y = mouseY
        break
      case ResizeHandleEnum.BOTTOM_LEFT:
        rect.value.w += rect.value.x - mouseX
        rect.value.x = mouseX
        rect.value.h = mouseY - rect.value.y
        break
      case ResizeHandleEnum.BOTTOM_RIGHT:
        rect.value.w = mouseX - rect.value.x
        rect.value.h = mouseY - rect.value.y
        break
      case ResizeHandleEnum.TOP:
        rect.value.h += rect.value.y - mouseY
        rect.value.y = mouseY
        break
      case ResizeHandleEnum.BOTTOM:
        rect.value.h = mouseY - rect.value.y
        break
      case ResizeHandleEnum.LEFT:
        rect.value.w += rect.value.x - mouseX
        rect.value.x = mouseX
        break
      case ResizeHandleEnum.RIGHT:
        rect.value.w = mouseX - rect.value.x
        break
    }
    clampRect()
    drawCanvas()
    return
  }

  if (isDragging.value) {
    rect.value.x = mouseX - dragOffsetX.value
    rect.value.y = mouseY - dragOffsetY.value
    clampRect()
    drawCanvas()
    return
  }

  if (isCreating.value) {
    rect.value.w = mouseX - rect.value.x
    rect.value.h = mouseY - rect.value.y
    clampRect()
    drawCanvas()
  }
}

const handleMouseUp = () => {
  isDragging.value = false
  isCreating.value = false
  isResizing.value = undefined
}

watch(() => props.config?.image, init)

defineExpose({
  getImageResized: () => {
    if (!rect.value) return
    return getImageResized(newImageSelected.value, rect.value.w, rect.value.h)
  }
})
</script>

<template>
  <canvas
    ref="canvasRef"
    :width="WIDTH"
    :height="HEIGHT"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseUp"
  />
</template>
