const { execSync } = require('node:child_process')
const { version: packageVersion } = require('./package.json')

function runGit(command, fallback) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim()
  } catch {
    return fallback
  }
}

const major = String(packageVersion || '1.0.0').split('.')[0] || '1'
const commitCount = runGit('git rev-list --count HEAD', '0')
const shortHash = runGit('git rev-parse --short HEAD', 'local')
const gameVersion = `v${major}.${commitCount}`
const buildLabel = `${gameVersion}+${shortHash}`

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GAME_VERSION: gameVersion,
    NEXT_PUBLIC_BUILD_HASH: shortHash,
    NEXT_PUBLIC_BUILD_LABEL: buildLabel,
  },
}

module.exports = nextConfig

