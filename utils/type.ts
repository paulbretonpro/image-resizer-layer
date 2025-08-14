export interface IRectangle {
  x: number
  y: number
  w: number
  h: number
}

export interface IConfigResizer {
  image?: File
  isDraggable?: boolean
  isResizabled?: boolean
  type?: string // type de l'image en sortie
  quality?: number // qualiter de l'image en sortie
}

export enum ResizeHandleEnum {
  BOTTOM = 'b',
  BOTTOM_LEFT = 'bl',
  BOTTOM_RIGHT = 'br',
  LEFT = 'l',
  RIGHT = 'r',
  TOP = 't',
  TOP_LEFT = 'tl',
  TOP_RIGHT = 'tr',
}
 