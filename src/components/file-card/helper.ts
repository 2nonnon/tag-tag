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

function addZero(num: number) {
  return num < 10 ? `0${num}` : `${num}`
}

function tempAddZero(str: TemplateStringsArray, ...args: number[]) {
  return args.reduce((res, cur, i) => res + addZero(cur) + str[i + 1], str[0])
}

export function parseTime(time: number) {
  const date = new Date(time)
  return tempAddZero`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}
