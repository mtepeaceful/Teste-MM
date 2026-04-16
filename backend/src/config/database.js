import Datastore from '@seald-io/nedb'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const db = new Datastore({
  filename: join(__dirname, '..', '..', 'data', 'destinations.db'),
  autoload: true
})

export default db
