import YAML from 'yaml'
import fs from 'fs-extra'
import path from 'path'

type ReplacementMap = { [key: string]: string }

export function replaceInObject(obj: any, data: ReplacementMap) {
  const stringified = JSON.stringify(obj)
  let replaced = stringified
  for (const [key, value] of Object.entries(data)) {
    replaced = replaced.replace(new RegExp(key, "g"), value)
  }
  return JSON.parse(replaced)
}

const cache: any = {}

export async function config(filePath: string | string[], replacements: ReplacementMap, useCache = true) {
  if (Array.isArray(filePath)) {
    filePath = path.join(...filePath)
  }

  let data: string

  if (useCache) {
    data = cache[filePath]
  } else {
    const file = await fs.readFile(filePath, 'utf8')
    data = YAML.parse(file)
  }

  cache[filePath] = data
  
  return replaceInObject(data, replacements)
}

