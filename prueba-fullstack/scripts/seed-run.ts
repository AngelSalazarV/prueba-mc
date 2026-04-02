import 'dotenv/config'
import { seed } from './seed.js'
import path from 'path'
import { fileURLToPath } from 'url'
import { pathToFileURL } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const configPath = path.resolve(dirname, '../src/payload.config.ts')

async function run() {
  try {
    // Usar file:// URL para ESM
    const configUrl = pathToFileURL(configPath).href
    const { default: config } = await import(configUrl)

    const { getPayload } = await import('payload')

    // Inicializar Payload
    const payload = await getPayload({ config })

    await seed(payload)
    process.exit(0)
  } catch (error) {
    console.error('Error durante seed:', error)
    process.exit(1)
  }
}

run()
