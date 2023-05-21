import * as core from '@actions/core'
import * as semver from 'semver'
import {getNomadIndex} from './installer'

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

export async function resolveVersionInput(): Promise<string> {
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
