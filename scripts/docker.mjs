import console from 'node:console'
import { execFileSync } from 'node:child_process'
import process from 'node:process'
import { randomUUID } from 'node:crypto'
import { smoke } from '../tests/docker/smoke.mjs'

export function docker(...args) {
  try {
    return execFileSync('docker', args, {
      encoding: 'utf8',
      maxBuffer: 16 * 1024 * 1024,
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  } catch (error) {
    throw new Error(
      `docker ${args.slice(0, 3).join(' ')} failed:\n${String(error.stderr || error.message).slice(-6000)}`,
      { cause: error },
    )
  }
}

function build(image, origin) {
  docker(
    'build',
    '--quiet',
    '--build-arg',
    `VITE_SITE_ORIGIN=${origin}`,
    '-t',
    image,
    '.',
  )
  console.log(`Built ${image} (origin: ${origin || 'unset'})`)
}

const mode = process.argv[2]
if (mode === 'build') {
  build(
    process.env.PROJECT_ROUTER_IMAGE || 'project-router:local',
    process.env.VITE_SITE_ORIGIN || '',
  )
} else if (mode === 'test') {
  const prefix = `project-router-test-${randomUUID()}`
  const images = []
  const containers = []
  const cleanup = () => {
    for (const id of containers) {
      try {
        docker('rm', '-f', id)
      } catch {
        /* Already removed. */
      }
    }
    for (const image of images) {
      try {
        docker('image', 'rm', image)
      } catch {
        /* Failed build has no image. */
      }
    }
  }
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.once(signal, () => {
      cleanup()
      process.exit(1)
    })
  }
  try {
    for (const [index, origin] of ['', 'https://portfolio.test'].entries()) {
      const image = `${prefix}:${index}`
      images.push(image)
      build(image, origin)
      const id = docker(
        'run',
        '-d',
        '--name',
        `${prefix}-${index}`,
        '--read-only',
        '--tmpfs',
        '/tmp:rw,noexec,nosuid,size=16m,uid=101,gid=101',
        '--cap-drop',
        'ALL',
        '--security-opt',
        'no-new-privileges:true',
        '-p',
        '127.0.0.1::8080',
        image,
      )
      containers.push(id)
      await smoke(docker, id, image, origin)
      docker('rm', '-f', id)
      containers.pop()
    }
    console.log(
      'Docker smoke: both origin modes passed; owned resources removed.',
    )
  } finally {
    cleanup()
  }
} else {
  throw new Error('Usage: node scripts/docker.mjs build|test')
}
