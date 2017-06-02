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
  test('truncates to 100 lines', async () => {
    createTmpErrorLog()
    await Chopper.chop(tempErrorLog, 100)
    expect(errorLogLength()).toBe(100)
  })

  test('does not truncate when max is greater', async () => {
    createTmpErrorLog()
    await Chopper.chop(tempErrorLog, LOG_CHOPPER_MAX * 2)
    expect(errorLogLength()).toBe(LOG_CHOPPER_MAX)
  })
})
