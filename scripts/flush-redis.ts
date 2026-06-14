import { Redis } from 'ioredis'
import 'dotenv/config'

const redis = new Redis(process.env.REDIS_URL!)

const keys = await redis.keys('*')
console.log(`Found ${keys.length} keys`)

if (keys.length > 0) {
  await redis.del(...keys)
  console.log(`Deleted ${keys.length} keys`)
}

redis.disconnect()
