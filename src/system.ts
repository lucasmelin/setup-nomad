import os from 'os'

export function getPlatform(): string {
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

export function getArchitecture(): string {
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
