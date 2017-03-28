// @flow
/* global test, expect, describe, afterEach */

import path from 'path'
import fs from 'fs-extra'

import Chopper from './chopper'

const tempErrorLog = path.join(__dirname, '..', 'tmp', 'error.log')

function createTmpErrorLog () {
  let createBits = []
  for (var i = 0; i < (100000 - 1); i++) createBits.push('a\n')
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
    let oldLogLength = errorLogLength()
    await Chopper.chop(tempErrorLog)
    expect(errorLogLength()).toBe(~~(oldLogLength / 2))
  })

  test('does not chop a file if less than LOG_CHOPPER_MAX', async () => {
    Chopper.LOG_CHOPPER_MAX = 200000
    createTmpErrorLog()
    let oldLogLength = errorLogLength()
    await Chopper.chop(tempErrorLog)
    expect(errorLogLength()).toBe(oldLogLength)
  })
})
