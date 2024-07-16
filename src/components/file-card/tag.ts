// 命名规则：原文件名---标签_标签.拓展名

export function hasTag(name: string) {
  return name.includes('---')
}

export function getTagFromName(name: string) {
  if (!hasTag(name)) {
    return []
  }

  const arr = name.split('---')
  return arr[1].split('.')[0].split('-')
}

export function removeTagFromName(name: string) {
  if (!hasTag(name)) {
    return name
  }

  const arr = name.split('---')
  return `${arr[0]}.${arr[1].split('.')[1]}`
}

export function addTagToName(name: string, tags: string[]) {
  if (!tags.length) {
    return name
  }

  const $name = hasTag(name) ? removeTagFromName(name) : name

  const arr = $name.split('.')

  return `${arr[0]}---${tags.join('-')}.${arr[1]}`
}
