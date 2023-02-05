import * as core from '@actions/core'
import * as httpm from '@actions/http-client'
import * as tc from '@actions/tool-cache'
import {Release} from './release'
import os from 'os'
import path from 'path'

export async function getNomadIndex(): Promise<Release> {
  const http: httpm.HttpClient = new httpm.HttpClient(
    'setup-nomad (GitHub Action)',
    [],
    {
      headers: {
        Accept:
          'application/vnd+hashicorp.releases-api.v0+json;application/vnd+hashicorp.releases-api.v1+json',
        'Content-Type': 'application/json'
      }
    }
  )
  const indexUrl = 'https://releases.hashicorp.com/nomad/index.json'
  const res: httpm.HttpClientResponse = await http.get(indexUrl)
  const body: string = await res.readBody()
  const result: Release = JSON.parse(body)
  return result
}

export async function installNomadVersion(
  version: string,
  plat: string,
  architecture: string
): Promise<string> {
  core.info(`Acquiring ${version}`)

  // Windows requires that we keep the extension (.zip) for extraction
  const isWindows = os.platform() === 'win32'
  const tempDir = process.env.RUNNER_TEMP || '.'
  const fileName = isWindows
    ? path.join(tempDir, `nomad_${version}_${plat}_${architecture}.zip`)
    : undefined

  const downloadPath = await tc.downloadTool(
    `https://releases.hashicorp.com/nomad/${version}/nomad_${version}_${plat}_${architecture}.zip`,
    fileName
  )

  core.info('Extracting Nomad...')
  const nomadExtractedFolder = await tc.extractZip(downloadPath)
  core.info(`Successfully extracted Nomad to ${nomadExtractedFolder}`)
  core.info('Adding to the cache...')
  const cachedDir = await tc.cacheDir(
    nomadExtractedFolder,
    'nomad',
    version,
    architecture
  )
  core.info(`Successfully cached Nomad to ${cachedDir}`)
  return cachedDir
}
