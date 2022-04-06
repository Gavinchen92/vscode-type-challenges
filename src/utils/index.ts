import * as fs from 'fs'
import * as path from 'path'
import * as YAML from 'js-yaml'
import type { Question } from '../type'
import * as fse from 'fs-extra'
import { homedir } from 'node:os'

export const defaultWorkSpace = `${homedir()}/.type-challenges`;

export const rootPath = path.join(__dirname, '..', '..', 'resources', 'questions')

export function getAllQuestions(): Question[] {
  const result: Question[] = []
  const questions = fs.readdirSync(rootPath)
  questions.forEach((folderName) => {
    const question: Question = {
      _original: folderName
    }
    const reg = /^(\d+)-([\s\S]+?)-([\s\S]+)$/
    const matches = folderName.match(reg)
    if (Array.isArray(matches)) {
      question.idx = parseInt(matches[1])
      question.difficulty = matches[2]
    }

    const infoPath = path.join(rootPath, folderName, 'info.yml')
    if (fs.existsSync(infoPath)) {
      const info = loadInfo(fs.readFileSync(infoPath).toString())
      question.info = info
      question.title = info.title
    }

    const readMePath = path.join(rootPath, folderName, 'README.md')
    if (fs.existsSync(readMePath)) {
      question.readMe = fs.readFileSync(readMePath).toString()
    }

    const readMeJaPath = path.join(rootPath, folderName, 'README.ja.md')
    if (fs.existsSync(readMeJaPath)) {
      question.readMeJa = fs.readFileSync(readMeJaPath).toString()
    }

    const readMeKoPath = path.join(rootPath, folderName, 'README.ko.md')
    if (fs.existsSync(readMeKoPath)) {
      question.readMeKo = fs.readFileSync(readMeKoPath).toString()
    }

    const readMeZhPath = path.join(rootPath, folderName, 'README.zh-CN.md')
    if (fs.existsSync(readMeZhPath)) {
      question.readMeZh = fs.readFileSync(readMeZhPath).toString()
    }

    result.push(question)
  })

  result.sort((a, b) => a.idx! - b.idx!)
  return result
}

export function loadInfo(s: string): any {
  const object = YAML.load(s) as any
  if (!object) {
    return undefined
  }

  const arrayKeys = ['tags', 'related']

  for (const key of arrayKeys) {
    if (object[key]) {
      object[key] = (object[key] || '')
        .toString()
        .split(',')
        .map((i: string) => i.trim())
        .filter(Boolean)
    } else {
      object[key] = undefined
    }
  }

  return object
}

export const helperFileName = 'type-challenges-utils.ts'

export async function generateTsHelp() { 
  const filePath = path.resolve(defaultWorkSpace, helperFileName);
  const exists = await fse.pathExists(filePath);

  if (!exists) {
    const oriFile = path.join(__dirname, '..', '..', 'resources', helperFileName)
    await fse.copy(oriFile, filePath)
  }
}