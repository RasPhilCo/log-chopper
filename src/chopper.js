// @flow
import fs from 'fs-extra'
import path from 'path'

/**
 * Utility for truncating logs
 * @class
 */
export default class LogChopper {
  static LOG_CHOPPER_MAX = parseInt(process.env.LOG_CHOPPER_MAX || 100000, 10)

  /**
   * chop a log file in half
   * @param {string} filepath - log path
   * @example
   * ```js
   * const chopper = require('log-chopper')
   * await chopper.chop('/path/to/log')
   * ```
   */
  static async chop (filepath: string) {
    let file = path.normalize(filepath)
    let errorLogBits = fs.readFileSync(file).toString().split('\n')
    let logLength = errorLogBits.length
    if (logLength >= this.LOG_CHOPPER_MAX) {
      let tempfile = file + '.tmp'
      fs.removeSync(tempfile)
      fs.moveSync(file, tempfile)
      let truncErrorLogBits = errorLogBits.slice(~~(logLength / 2), logLength)
      fs.writeFileSync(filepath, truncErrorLogBits.join('\n'))
      fs.removeSync(tempfile)
    }
  }
}
