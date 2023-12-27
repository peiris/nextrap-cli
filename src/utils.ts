import fs from 'fs'
import chalk from 'chalk'
import { createSpinner } from 'nanospinner'

type PrintFunction = (text: string) => string;

export const print: Record<string, PrintFunction> = {
  success: (text: string) => chalk.hex('#a3e635')(text),
  question: (text: string) => chalk.hex('#4ade80')(text),
  complete: (text: string) => chalk.hex('#8b5cf6')(text),
  error: (text: string) => chalk.red(text),
  progress: (text: string) => chalk.magentaBright(text),
  info: (text: string) => chalk.magentaBright(text),
  hint: (text: string) => chalk.gray(text),
  default: (text: string) => chalk.gray(text),
}

export const log = {
  success: (text: string) => console.log(print.success(text)),
  complete: (text: string) => console.log(print.complete(text)),
  error: (text: string) => console.log(print.error(text)),
  progress: (text: string) => console.log(print.progress(text)),
  info: (text: string) => console.log(print.info(text)),
  hint: (text: string) => console.log(print.hint(text)),
  default: (text: string) => console.log(print.default(text)),
}

export const startSpinner = (text: string) => {
  const spinner = createSpinner(print.progress(text))
  spinner.start()
  return spinner
}

export const folderExists = async (folderName: string): Promise<boolean> => {
  try {
    await fs.promises.access(folderName)
    return true
  } catch {
    return false
  }
}

export const fetchText = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.text()
  } catch (error) {
    log.error((error as Error).message)
    process.exit(1)
  }
}
