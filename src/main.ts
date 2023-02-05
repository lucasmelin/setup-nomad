import * as core from '@actions/core'
import * as io from '@actions/io'
import cp from 'child_process'
import path from 'path'
import {getNomad} from './installer'
import {resolveVersionInput} from './version'
import {getPlatform, getArchitecture} from './system'

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
