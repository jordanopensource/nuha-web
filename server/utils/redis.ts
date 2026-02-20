import Redis from 'ioredis'

let redisClient: Redis | null = null
let redisInitialized = false

// create the Redis client instance
export function getRedisClient(): Redis | null {
  if (redisInitialized) {
    return redisClient
  }

  try {
    const config = useRuntimeConfig()

    if (!config.redis?.host) {
      console.warn('Redis not configured.')
      return null
    }

    redisClient = new Redis({
      host: config.redis.host,
      port: parseInt(config.redis.port || '6379'),
      password: config.redis.password || undefined,
      db: parseInt(config.redis.db || '0'),
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    })

    // Test connection
    redisClient
      .ping()
      .then(() => {
        console.info('Redis connection successful.')
      })
      .catch((error) => {
        console.warn(
          'Redis connection failed:',
          error.message
        )
        redisClient?.disconnect()
        redisClient = null
      })

    redisInitialized = true
    return redisClient
  } catch (error) {
    console.warn(
      'Redis connection initialization failed:',
      error
    )
    redisClient = null
    return null
  }
}

// Helper to get redis key prefix
export function getRedisKey(key: string): string {
  const config = useRuntimeConfig()
  const keyPrefix = config.redis?.keyPrefix || 'nuha:'
  return `${keyPrefix}${key}`
}
