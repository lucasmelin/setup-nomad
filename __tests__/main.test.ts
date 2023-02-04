import * as utils from '../src/installer'
import * as cp from 'child_process'
import {expect, test, jest} from '@jest/globals'
import {getLatestVersion} from '../src/main'
import path from 'path'

const cachePath = path.join(__dirname, 'CACHE')
const tempPath = path.join(__dirname, 'TEMP')
// Set temp and tool directories before importing (used to set global state)
process.env['RUNNER_TEMP'] = tempPath
process.env['RUNNER_TOOL_CACHE'] = cachePath

test('the latest version is returned', async () => {
  jest.spyOn(utils, 'getNomadIndex').mockImplementation(async () => {
    return {
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
          version: '0.1.1'
        }
      }
    }
  })
  const release = await getLatestVersion()
  expect(release).toBe('0.1.1')
})

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', async () => {
  process.env['INPUT_VERSION'] = '0.2.0'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  }
  console.log(cp.execFileSync(np, [ip], options).toString())
})
