import {expect, test, jest} from '@jest/globals'
import {Release} from '../src/release'

jest.mock('../src/installer')

import {getLatestVersion} from '../src/version'
import {getNomadIndex} from '../src/installer'

test('the latest version is returned', async () => {
  ;(getNomadIndex as jest.Mock).mockImplementation(async () => {
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
