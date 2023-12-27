/**
 * Utility functions for the NextRAP CLI.
 */

import fs from 'fs'
import chalk from 'chalk'
import { createSpinner } from 'nanospinner'

/**
 * A collection of print functions for different types of messages.
 */
export const print = {
  /**
   * Prints a success message in green color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  success: (text: string) => chalk.hex('#a3e635')(text),

  /**
   * Prints a question message in light green color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  question: (text: string) => chalk.hex('#4ade80')(text),

  /**
   * Prints a complete message in purple color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  complete: (text: string) => chalk.hex('#8b5cf6')(text),

  /**
   * Prints an error message in red color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  error: (text: string) => chalk.red(text),

  /**
   * Prints a progress message in magenta color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  progress: (text: string) => chalk.magentaBright(text),

  /**
   * Prints an info message in magenta color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  info: (text: string) => chalk.magentaBright(text),

  /**
   * Prints a hint message in gray color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  hint: (text: string) => chalk.gray(text),

  /**
   * Prints a default message in gray color.
   * @param text - The text to be printed.
   * @returns The formatted text.
   */
  default: (text: string) => chalk.gray(text),
}

/**
 * A collection of log functions for different types of messages.
 */
export const log = {
  /**
   * Logs a success message in green color.
   * @param text - The text to be logged.
   */
  success: (text: string) => console.log(print.success(text)),

  /**
   * Logs a complete message in purple color.
   * @param text - The text to be logged.
   */
  complete: (text: string) => console.log(print.complete(text)),

  /**
   * Logs an error message in red color.
   * @param text - The text to be logged.
   */
  error: (text: string) => console.log(print.error(text)),

  /**
   * Logs a progress message in magenta color.
   * @param text - The text to be logged.
   */
  progress: (text: string) => console.log(print.progress(text)),

  /**
   * Logs an info message in magenta color.
   * @param text - The text to be logged.
   */
  info: (text: string) => console.log(print.info(text)),

  /**
   * Logs a hint message in gray color.
   * @param text - The text to be logged.
   */
  hint: (text: string) => console.log(print.hint(text)),

  /**
   * Logs a default message in gray color.
   * @param text - The text to be logged.
   */
  default: (text: string) => console.log(print.default(text)),
}

/**
 * Starts a spinner with the given text.
 * @param text - The text to be displayed in the spinner.
 * @returns The spinner instance.
 */
export const startSpinner = (text: string) => {
  const spinner = createSpinner(print.progress(text))
  spinner.start()
  return spinner
}

/**
 * Checks if a folder exists.
 * @param folderName - The name of the folder to check.
 * @returns A promise that resolves to true if the folder exists, false otherwise.
 */
export const folderExists = async (folderName: string): Promise<boolean> => {
  try {
    await fs.promises.access(folderName)
    return true
  } catch {
    return false
  }
}

/**
 * Fetches the text content from a URL.
 * @param url - The URL to fetch the text from.
 * @returns A promise that resolves to the fetched text.
 */
export const fetchText = async (url: string) => {
  try {
    const response = await fetch(url)
    return response.text()
  } catch (error) {
    log.error((error as Error).message)
    process.exit(1)
  }
}
