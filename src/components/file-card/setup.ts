/* eslint-disable no-restricted-globals */
export function setup() {
  async function getImageDataByUrl({ src, name }: {
    name: string
    src: string
  }): Promise<{
    imageBitmap: ImageBitmap
    name: string
    type: string
    size: number
    lastModified: number
  }> {
    const res = await fetch(src)
    const blob = await res.blob()
    const file = new File([blob], name)

    const imageBitmap = await createImageBitmap(blob)

    return {
      imageBitmap,
      name: file.name,
      type: blob.type,
      size: file.size,
      lastModified: file.lastModified,
    }
  }

  async function imageCompress(
    img: Exclude<CanvasImageSource, VideoFrame>,
    quality: number,
  ): Promise<Blob> {
    const dataWidth = +img.width
    const dataHeight = +img.height
    const width = dataWidth * quality
    const height = dataHeight * quality
    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, 0, 0, width, height)
    return await canvas.convertToBlob({ type: 'image/jpeg', quality })
  }

  self.onmessage = async (e: { data: { src: string, name: string } }) => {
    if (e.data.src) {
      try {
        const { imageBitmap, ...imgInfo } = await getImageDataByUrl(e.data)
        const blob = await imageCompress(imageBitmap, 0.5)

        self.postMessage({ blob, ...imgInfo, width: imageBitmap.width, height: imageBitmap.height })

        imageBitmap.close()
      }
      catch (e) {
        self.reportError(e)
      }
    }
  }
}
