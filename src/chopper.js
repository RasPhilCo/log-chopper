// @flow
import fs from 'fs-extra'
import path from 'path'
import LineReader from '../vendor/line_by_line'

const LOG_CHOPPER_MAX = parseInt(process.env.LOG_CHOPPER_MAX || 100000)

/**
 * Utility for truncating logs
 * @class
 */
export default class LogChopper {
  /**
   * chop a log file in half
   * @param {string} filepath - log path
   * @example
   * ```js
   * const chopper = require('log-chopper')
   * await chopper.chop('/path/to/log')
   * ```
   */
  static async chop (filepath: string, logLineMax: number = LOG_CHOPPER_MAX) {
    let file = path.normalize(filepath)
    let lines = []
    let log = new LineReader(file)
    var line
    while ((line = await log.readLine()) !== null) {
      if (lines.length >= logLineMax) lines.shift()
      lines.push(line)
    }
    let logLength = lines.length
    if (logLength >= logLineMax) {
      let truncLines = lines.slice(~~(logLength / 2), logLength)
      fs.outputFileSync(file, truncLines.join('\n'))
    }
  }
}
