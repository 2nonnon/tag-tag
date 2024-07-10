export function parseType(type: string) {
  return type.split('/').pop()?.toUpperCase()
}

const KB = 1024
const MB = KB * 1024
const GB = MB * 1024

export function parseSize(size: number) {
  if (size < KB) {
    return `${size}B`
  }
  else if (size < MB) {
    return `${(size / KB).toFixed(2)} KB`
  }
  else if (size < GB) {
    return `${(size / (MB)).toFixed(2)} MB`
  }
  else {
    return `${(size / (GB)).toFixed(2)} GB`
  }
}

export function parseTime(time: number) {
  const date = new Date(time)
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
