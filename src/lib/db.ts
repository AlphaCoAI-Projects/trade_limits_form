import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI as string
const client = new MongoClient(uri)
let cachedDb: Db | null = null

export async function connectToDatabase(): Promise<Db> {
  if (cachedDb) return cachedDb

  await client.connect()
  const db = client.db("quant")
  cachedDb = db
  return db
}
