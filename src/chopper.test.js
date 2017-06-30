// @flow
/* global test, expect, describe, afterEach */

import fs from 'fs-extra'
import tmp from 'tmp'

import Chopper from './chopper'

const LOG_CHOPPER_MAX = 100000

function createTmpErrorLog (logLength = LOG_CHOPPER_MAX) {
  let f = tmp.tmpNameSync()
  let createBits = []
  for (var i = 0; i < (logLength - 1); i++) createBits.push('a\n')
  createBits.push('a')
  fs.outputFileSync(f, createBits.join(''))
  return f
}

function errorLogLength (f: string) {
  return fs.readFileSync(f).toString().split('\n').length
}

describe('Chopper.chop()', () => {
  test('truncates to 100 lines', async () => {
    let f = createTmpErrorLog()
    await Chopper.chop(f, 100)
    expect(errorLogLength(f)).toBe(100)
    fs.removeSync(f)
  })

  test('does not truncate when max is greater', async () => {
    let f = createTmpErrorLog()
    await Chopper.chop(f, LOG_CHOPPER_MAX * 2)
    expect(errorLogLength(f)).toBe(LOG_CHOPPER_MAX)
    fs.removeSync(f)
  })

  test('fails when file does not exist', async () => {
    expect.assertions(1)
    try {
      await Chopper.chop('FILETHATDOESNOTEXIST')
    } catch (err) {
      expect(err).toMatchObject({code: 'ENOENT'})
    }
  })
})
