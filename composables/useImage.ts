export default function (config: IConfigResizer) {
  const loadedImage = ref<HTMLImageElement>()

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    if (loadedImage.value) {
      const imgRatio = loadedImage.value.width / loadedImage.value.height
      const canvasRatio = ctx.canvas.width / ctx.canvas.height
      let drawWidth, drawHeight, offsetX, offsetY

      if (canvasRatio > imgRatio) {
        drawHeight = ctx.canvas.height
        drawWidth = loadedImage.value.width * (drawHeight / loadedImage.value.height)
        offsetX = (ctx.canvas.width - drawWidth) / 2
        offsetY = 0
      } else {
        drawWidth = ctx.canvas.width
        drawHeight = loadedImage.value.height * (drawWidth / loadedImage.value.width)
        offsetX = 0
        offsetY = (ctx.canvas.height - drawHeight) / 2
      }
      ctx.drawImage(loadedImage.value, offsetX, offsetY, drawWidth, drawHeight)
    }
  }

  const getImageResized = (image: ImageData | undefined, width: number, height: number) => {
    if (!image) return

    // Création d'un canvas temporaire
    const tempCanvas = document.createElement('canvas')
    tempCanvas.width = width
    tempCanvas.height = height
    const tempCtx = tempCanvas.getContext('2d')
    if (!tempCtx) return

    tempCtx.putImageData(image, 0, 0)

    // Exporter en base64
    return tempCanvas.toDataURL(config.type, config.quality)
  }

  return {
    drawImage,
    getImageResized,
    loadedImage
  }
}