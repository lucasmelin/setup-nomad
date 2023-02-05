import * as cp from 'child_process'
import * as io from '@actions/io'
import {test, beforeEach, afterAll} from '@jest/globals'

import path from 'path'

const cachePath = path.join(__dirname, 'CACHE')
const tempPath = path.join(__dirname, 'TEMP')
// Set temp and tool directories before importing (used to set global state)
process.env['RUNNER_TEMP'] = tempPath
process.env['RUNNER_TOOL_CACHE'] = cachePath

beforeEach(async function () {
  await io.rmRF(cachePath)
  await io.rmRF(tempPath)
  await io.mkdirP(cachePath)
  await io.mkdirP(tempPath)
})

afterAll(async function () {
  await io.rmRF(tempPath)
  await io.rmRF(cachePath)
})

// shows how the runner will run a javascript action with env / stdout protocol
// skipping this test normally since it currently actually downloads a binary
test.skip('test runs', async () => {
  process.env['INPUT_VERSION'] = '1.4.0'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
