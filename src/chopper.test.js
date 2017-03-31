// @flow
/* global test, expect, describe, afterEach */

import path from 'path'
import fs from 'fs-extra'

import Chopper from './chopper'

const LOG_CHOPPER_MAX = 100000
const tempErrorLog = path.join(__dirname, '..', 'tmp', 'error.log')

function createTmpErrorLog (logLength = LOG_CHOPPER_MAX) {
  let createBits = []
  for (var i = 0; i < (logLength - 1); i++) createBits.push('a\n')
  createBits.push('a')
  fs.ensureFileSync(tempErrorLog)
  fs.writeFileSync(tempErrorLog, createBits.join(''))
}

function errorLogLength () {
  return fs.readFileSync(tempErrorLog).toString().split('\n').length
}

afterEach(() => {
  fs.removeSync(tempErrorLog)
})

describe('Chopper.chop()', () => {
  test('chops a file in half', async () => {
    createTmpErrorLog()
    await Chopper.chop(tempErrorLog, LOG_CHOPPER_MAX)
    expect(errorLogLength()).toBe(~~(LOG_CHOPPER_MAX / 2))
  })

  test('does not chop a file if less than LOG_CHOPPER_MAX', async () => {
    createTmpErrorLog()
    await Chopper.chop(tempErrorLog, LOG_CHOPPER_MAX * 2)
    expect(errorLogLength()).toBe(LOG_CHOPPER_MAX)
  })
})
