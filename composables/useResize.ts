import { HANDLE_SIZE } from '../utils/constants'
export default function () {
  const isResizing = ref<ResizeHandleEnum>()

  const getHandles = (r: IRectangle) => [
    { x: r.x, y: r.y, name: ResizeHandleEnum.TOP_LEFT },
    { x: r.x + r.w, y: r.y, name: ResizeHandleEnum.TOP_RIGHT },
    { x: r.x, y: r.y + r.h, name: ResizeHandleEnum.BOTTOM_LEFT },
    { x: r.x + r.w, y: r.y + r.h, name: ResizeHandleEnum.BOTTOM_LEFT },
    { x: r.x + r.w / 2, y: r.y, name: ResizeHandleEnum.TOP },
    { x: r.x + r.w / 2, y: r.y + r.h, name: ResizeHandleEnum.BOTTOM },
    { x: r.x, y: r.y + r.h / 2, name: ResizeHandleEnum.LEFT },
    { x: r.x + r.w, y: r.y + r.h / 2, name: ResizeHandleEnum.RIGHT }
  ]

  const getHandleAt = (rect: IRectangle | undefined, x: number, y: number): ResizeHandleEnum | undefined => {
    if (!rect) return undefined
    return (getHandles(rect).find(h =>
      x >= h.x - HANDLE_SIZE / 2 &&
      x <= h.x + HANDLE_SIZE / 2 &&
      y >= h.y - HANDLE_SIZE / 2 &&
      y <= h.y + HANDLE_SIZE / 2
    )?.name as ResizeHandleEnum) || undefined
  }

  return {
    getHandleAt,
    getHandles,
    isResizing
  }
}