import * as core from '@actions/core'
import * as io from '@actions/io'
import * as semver from 'semver'
import * as tc from '@actions/tool-cache'
import {getNomadIndex, installNomadVersion} from './installer'
import cp from 'child_process'
import os from 'os'
import path from 'path'

async function run(): Promise<void> {
  try {
    const version = await resolveVersionInput()
    const plat = getPlatform()
    const architecture = getArchitecture()
    const installDir = await getNomad(version, plat, architecture)
    core.addPath(path.join(installDir))
    core.info('Added Nomad to the PATH')

    const nomadPath = await io.which('nomad')
    const nomadVersion = (cp.execSync(`${nomadPath} version`) || '').toString()

    core.info(nomadVersion)
    core.setOutput('nomad-version', version)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()

async function getNomad(
  version: string,
  plat: string,
  architecture: string
): Promise<string> {
  // check cache
  const toolPath = tc.find('nomad', version, architecture)
  // If not found in cache, download
  if (toolPath) {
    core.info(`Found in cache @ ${toolPath}`)
    return toolPath
  }
  core.info(`Attempting to download ${version}...`)
  const nomadPath = await installNomadVersion(version, plat, architecture)
  return nomadPath
}

function getPlatform(): string {
  const platform = os.platform()
  switch (platform) {
    case 'darwin':
    case 'linux':
      return platform
    case 'win32':
      return 'windows'
    default:
      throw new Error(`Unsupported platform ${platform}`)
  }
}

function getArchitecture(): string {
  const architecture = os.arch()
  switch (architecture) {
    case 'arm':
    case 'arm64':
      return architecture
    case 'x32':
      return '386'
    case 'x64':
      return 'amd64'
    default:
      throw new Error(`Unsupported architecture ${architecture}`)
  }
}

async function resolveVersionInput(): Promise<string> {
  const version = core.getInput('version')
  const validVersion = semver.validRange(version, {
    includePrerelease: true,
    loose: true
  })
  // 'latest' is an invalid version,
  // which will make us always retrieve the latest version
  if (validVersion && version !== '') {
    return version
  }

  return getLatestVersion()
}

export async function getLatestVersion(): Promise<string> {
  const obj = await getNomadIndex()

  const versions = Object.keys(obj.versions).filter(
    v => semver.valid(v) !== null
  )
  const latest = versions
    .filter(v => !semver.prerelease(v))
    .sort((a, b) => semver.rcompare(a, b))[0]

  return latest
}
