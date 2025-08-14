export default function () {
  const rect = ref<IRectangle>()
  const isDragging = ref(false)
  const isCreating = ref(false)

  const mouseIsInSelectionArea = (mouseX: number, mouseY: number) => {
    return rect.value &&
      mouseX >= rect.value.x &&
      mouseX <= rect.value.x + rect.value.w &&
      mouseY >= rect.value.y &&
      mouseY <= rect.value.y + rect.value.h
  }

  return {
    isCreating,
    isDragging,
    mouseIsInSelectionArea,
    rect
  }
}