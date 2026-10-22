import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import process from 'node:process'
import console from 'node:console'
import { verifyOrigin } from './verify-origin.mjs'

const repository = 'ghcr.io/danilfaritovich/project-router'
export function imageDigest(image) {
  assert.match(
    image,
    /^ghcr\.io\/danilfaritovich\/project-router@sha256:[a-f0-9]{64}$/,
  )
  return image.split('@')[1]
}

export function verifiedManifest(bytes, digest) {
  // Buildx appends a display newline on some versions; it is not registry content.
  const candidates = [bytes, bytes.subarray(0, bytes.length - 1)]
  const raw = candidates.find(
    (value) =>
      `sha256:${createHash('sha256').update(value).digest('hex')}` === digest,
  )
  assert.ok(raw, 'Registry manifest bytes do not match expected digest')
  return { raw, value: JSON.parse(raw.toString('utf8')) }
}

export function amd64Descriptor(index) {
  const candidates = index.manifests.filter(
    (item) =>
      item.platform?.os === 'linux' &&
      item.platform?.architecture === 'amd64' &&
      !item.platform?.variant,
  )
  assert.equal(
    candidates.length,
    1,
    'Expected exactly one linux/amd64 runtime manifest',
  )
  assert.match(candidates[0].digest, /^sha256:[a-f0-9]{64}$/)
  return candidates[0]
}

export function verifiedRuntimeConfig(metadata, bytes, descriptor) {
  const config = verifiedManifest(bytes, descriptor.digest)
  assert.equal(config.raw.length, descriptor.size)
  assert.equal(config.value.os, 'linux')
  assert.equal(config.value.architecture, 'amd64')
  assert.deepEqual(metadata.RootFS.Layers, config.value.rootfs.diff_ids)
  for (const key of ['User', 'Env', 'Entrypoint', 'Cmd', 'Healthcheck']) {
    assert.deepEqual(
      metadata.Config[key],
      config.value.config[key],
      `Local ${key} differs from verified config`,
    )
  }
  return config
}

// Registry reads, a local pull and an unstarted UUID container only. No network creation.
export async function verifyImage(image, origin, evidenceDirectory) {
  const digest = imageDigest(image)
  const docker = (...args) =>
    execFileSync('docker', args, {
      maxBuffer: 32 * 1024 * 1024,
      timeout: 180000,
    })
  const top = verifiedManifest(
    docker('buildx', 'imagetools', 'inspect', '--raw', image),
    digest,
  )
  let manifest = top
  let childDigest = digest
  if (top.value.manifests) {
    const child = amd64Descriptor(top.value)
    childDigest = child.digest
    manifest = verifiedManifest(
      docker(
        'buildx',
        'imagetools',
        'inspect',
        '--raw',
        `${repository}@${childDigest}`,
      ),
      childDigest,
    )
    assert.equal(manifest.raw.length, child.size)
  }
  docker('pull', '--quiet', '--platform', 'linux/amd64', image)
  const metadata = JSON.parse(docker('image', 'inspect', image).toString())[0]
  assert.equal(metadata.Os, 'linux')
  assert.equal(metadata.Architecture, 'amd64')
  assert.ok(
    metadata.RepoDigests.includes(image),
    'Local image must retain the requested registry identity',
  )
  assert.equal(metadata.Config.User, '101:101')
  assert.ok(
    metadata.Config.Healthcheck.Test.join(' ').includes(
      'http://127.0.0.1:8080/en/',
    ),
  )
  const directory = await mkdtemp(resolve(tmpdir(), 'project-router-origin-'))
  let id
  try {
    // Classic stores use the config digest as ID; containerd may use the index ID.
    // Verify exported config bytes instead of assuming either representation.
    const archive = resolve(directory, 'image.tar')
    docker('image', 'save', '--output', archive, image)
    const tar = (entry) =>
      execFileSync('tar', ['-xOf', archive, '--', entry], {
        maxBuffer: 32 * 1024 * 1024,
        timeout: 30000,
      })
    const configDigest = manifest.value.config.digest
    assert.match(configDigest, /^sha256:[a-f0-9]{64}$/)
    const hex = configDigest.slice(7)
    const records = JSON.parse(tar('manifest.json').toString())
    const record = records.find((item) =>
      [`blobs/sha256/${hex}`, `${hex}.json`].includes(item.Config),
    )
    assert.ok(
      record,
      'Local image archive does not contain expected registry config',
    )
    const config = verifiedRuntimeConfig(
      metadata,
      tar(record.Config),
      manifest.value.config,
    )
    await rm(archive)

    id = docker(
      'create',
      '--name',
      `project-router-inspect-${randomUUID()}`,
      '--platform',
      'linux/amd64',
      '--network',
      'none',
      '--read-only',
      image,
    )
      .toString()
      .trim()
    const container = JSON.parse(docker('inspect', id).toString())[0]
    assert.equal(container.Image, metadata.Id)
    assert.equal(container.Config.Image, image)
    docker('cp', `${id}:/usr/share/nginx/html/.`, directory)
    if (origin) await verifyOrigin(directory, origin)
    if (evidenceDirectory) {
      // The caller creates the directory. These are audit bytes, never trust flags.
      await writeFile(resolve(evidenceDirectory, 'index.json'), top.raw)
      await writeFile(resolve(evidenceDirectory, 'manifest.json'), manifest.raw)
      await writeFile(resolve(evidenceDirectory, 'config.json'), config.raw)
      await writeFile(
        resolve(evidenceDirectory, 'mapping.json'),
        JSON.stringify(
          {
            image,
            platform: 'linux/amd64',
            manifestDigest: childDigest,
            configDigest,
            localImageId: metadata.Id,
            origin,
          },
          null,
          2,
        ),
      )
    }
    console.log(
      `Verified ${image}: linux/amd64 → ${childDigest} → ${configDigest} (local ID ${metadata.Id}); built origin ${origin || 'not requested'}.`,
    )
  } finally {
    try {
      if (id) docker('rm', id)
    } finally {
      await rm(directory, { recursive: true, force: true })
    }
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  assert.ok(
    process.argv.length >= 4 && process.argv.length <= 5,
    'Usage: node scripts/verify-image.mjs <image@digest> <expected-origin> [existing-evidence-directory]',
  )
  await verifyImage(process.argv[2], process.argv[3], process.argv[4])
}
