export async function createImageBitmapByUrl(url: string): Promise<ImageBitmap> {
  const res = await fetch(url)
  const blob = await res.blob()
  return createImageBitmap(blob)
}

export async function imageCompressOff(
  img: Exclude<CanvasImageSource, VideoFrame>,
  quality: number,
): Promise<string> {
  const dataWidth = +img.width
  const dataHeight = +img.height
  const width = dataWidth * quality
  const height = dataHeight * quality
  const canvas = new OffscreenCanvas(width, height)
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)
  const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality })
  const url = URL.createObjectURL(blob)

  return url
}

export async function createLoadedImg(src: string): Promise<HTMLImageElement> {
  const { promise, resolve, reject } = Promise.withResolvers<HTMLImageElement>()

  const img = new Image()
  img.src = src
  img.crossOrigin = 'anonymous'

  img.onload = () => {
    resolve(img)
  }
  img.onerror = () => {
    reject()
  }

  return promise
}

export function imageCompress(
  img: Exclude<CanvasImageSource, VideoFrame>,
  quality: number,
): Promise<string> {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  const dataWidth = +img.width
  const dataHeight = +img.height
  const width = dataWidth * quality
  const height = dataHeight * quality
  canvas.width = width
  canvas.height = height
  ctx.drawImage(img, 0, 0, width, height)
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject()
        }
        else {
          const url = URL.createObjectURL(blob)
          resolve(url)
        }
      },
      'image/jpeg',
      quality,
    )
  })
}
