import * as utils from '../src/installer'
import * as cp from 'child_process'
import * as io from '@actions/io'
import {expect, test, jest, beforeEach, afterAll} from '@jest/globals'
import {getLatestVersion} from '../src/main'
import path from 'path'
import {Release} from '../src/release'

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

test('the latest version is returned', async () => {
  jest.spyOn(utils, 'getNomadIndex').mockImplementation(async () => {
    return <Release>{
      name: 'nomad',
      versions: {
        '0.1.0': {
          builds: [
            {
              arch: 'amd64',
              filename: 'nomad_0.1.0_darwin_amd64.zip',
              name: 'nomad',
              os: 'darwin',
              url: 'https://releases.hashicorp.com/nomad/0.1.0/nomad_0.1.0_darwin_amd64.zip',
              version: '0.1.0'
            }
          ],
          name: 'nomad',
          shasums: 'nomad_0.1.0_SHA256SUMS',
          shasums_signature: 'nomad_0.1.0_SHA256SUMS.sig',
          shasums_signatures: [
            'nomad_0.1.0_SHA256SUMS.348FFC4C.sig',
            'nomad_0.1.0_SHA256SUMS.72D7468F.sig',
            'nomad_0.1.0_SHA256SUMS.sig'
          ],
          version: '0.1.0'
        },
        '0.1.1': {
          builds: [
            {
              arch: 'amd64',
              filename: 'nomad_0.1.1_darwin_amd64.zip',
              name: 'nomad',
              os: 'darwin',
              url: 'https://releases.hashicorp.com/nomad/0.1.1/nomad_0.1.1_darwin_amd64.zip',
              version: '0.1.1'
            }
          ],
          name: 'nomad',
          shasums: 'nomad_0.1.1_SHA256SUMS',
          shasums_signature: 'nomad_0.1.1_SHA256SUMS.sig',
          shasums_signatures: [
            'nomad_0.1.1_SHA256SUMS.348FFC4C.sig',
            'nomad_0.1.1_SHA256SUMS.72D7468F.sig',
            'nomad_0.1.1_SHA256SUMS.sig'
          ],
          version: '0.1.1'
        }
      }
    }
  })
  const release = await getLatestVersion()
  expect(release).toBe('0.1.1')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_VERSION'] = '0.2.0'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
