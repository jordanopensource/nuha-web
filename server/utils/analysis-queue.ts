import { v4 as uuidv4 } from 'uuid'
import { getRedisClient, getRedisKey } from '~/server/utils/redis'
import type { AnalysisJob, CommentData, SingleResult } from '~/types/analyze'
import { AIService } from '~/server/utils/ai-service'

const JOB_TTL_SECONDS = 3600 * 24 * 2 // 2 days
const BATCH_SIZE = 50
const BATCH_DELAY_MS = 100 // to avoid rate limiting

export interface AnalysisStats {
  classes: Record<string, { count: number, totalConfidence: number }>
  platforms: Record<string, Record<string, number>>
  histogram: Record<string, number[]>
}

export class AnalysisQueue {
  private static getJobKey(id: string) {
    return getRedisKey(`analysis:${id}`)
  }

  static async createJob(comments: CommentData[], dialect: string = 'egy'): Promise<AnalysisJob> {
    const redis = getRedisClient()
    if (!redis) {
      throw new Error('Redis not available for analysis job creation')
    }

    const id = uuidv4()
    const now = new Date().toISOString()

    const job: AnalysisJob = {
      analysis_id: id,
      total_comments: comments.length,
      processed_comments: 0,
      status: 'pending',
      created_at: now,
      dialect
    }

    const key = this.getJobKey(id)

    // Store metadata
    await redis.hset(`${key}:meta`, job)

    // Store raw comments
    const commentsJson = comments.map(c => JSON.stringify(c))
    if (commentsJson.length > 0) {
      await redis.rpush(`${key}:comments`, ...commentsJson)
    }

    // Set expiration
    await redis.expire(`${key}:meta`, JOB_TTL_SECONDS)
    await redis.expire(`${key}:comments`, JOB_TTL_SECONDS)
    await redis.expire(`${key}:results`, JOB_TTL_SECONDS)
    await redis.expire(`${key}:stats:classes`, JOB_TTL_SECONDS)
    await redis.expire(`${key}:stats:platforms`, JOB_TTL_SECONDS)
    await redis.expire(`${key}:stats:histogram`, JOB_TTL_SECONDS)

    return job
  }

  static async getJob(id: string): Promise<AnalysisJob | null> {
    const redis = getRedisClient()
    if (!redis) return null

    const key = this.getJobKey(id)
    const meta = await redis.hgetall(`${key}:meta`)

    if (!meta || Object.keys(meta).length === 0) return null

    return {
      analysis_id: meta.analysis_id as string,
      total_comments: parseInt(meta.total_comments || '0'),
      processed_comments: parseInt(meta.processed_comments || '0'),
      status: meta.status as AnalysisJob['status'],
      created_at: meta.created_at as string,
      dialect: meta.dialect as string,
      error: meta.error
    }
  }

  static async updateJobStatus(id: string, status: AnalysisJob['status'], processed?: number) {
    const redis = getRedisClient()
    if (!redis) return

    const key = this.getJobKey(id)
    const updates: Record<string, string | number> = { status }
    if (processed !== undefined) {
      updates.processed_comments = processed
    }
    await redis.hset(`${key}:meta`, updates)
  }

  static async saveResults(id: string, results: SingleResult[]) {
    const redis = getRedisClient()
    if (!redis) return

    const key = this.getJobKey(id)
    const resultsJson = results.map(r => JSON.stringify(r))

    if (resultsJson.length > 0) {
      await redis.rpush(`${key}:results`, ...resultsJson)
    }

    // Update aggregated stats incrementally
    await this.updateStats(id, results)
  }

  static async updateStats(id: string, results: SingleResult[]) {
    const redis = getRedisClient()
    if (!redis) return

    const key = this.getJobKey(id)
    const multi = redis.multi()

    for (const result of results) {
      const className = result.main_class
      const platform = result.platform || 'Unknown'
      const confidence = result.confidence

      multi.hincrby(`${key}:stats:classes`, `${className}:count`, 1)
      multi.hincrbyfloat(`${key}:stats:classes`, `${className}:score`, confidence)

      multi.hincrby(`${key}:stats:platforms`, `${platform}:${className}`, 1)

      const bin = Math.min(9, Math.floor(confidence * 10))
      multi.hincrby(`${key}:stats:histogram`, `${className}:${bin}`, 1)
    }

    await multi.exec()
  }

  static async getOverview(id: string): Promise<any> {
    const redis = getRedisClient()
    if (!redis) return null

    const key = this.getJobKey(id)
    const [meta, classStats, platformStats, histogramStats] = await Promise.all([
      redis.hgetall(`${key}:meta`),
      redis.hgetall(`${key}:stats:classes`),
      redis.hgetall(`${key}:stats:platforms`),
      redis.hgetall(`${key}:stats:histogram`)
    ])

    if (!meta || Object.keys(meta).length === 0) return null

    // Parse Classes
    const classesMap: Record<string, { count: number, totalScore: number }> = {}
    for (const [field, value] of Object.entries(classStats)) {
      const [className, type] = field.split(':')
      if (className && !classesMap[className]) {
        classesMap[className] = { count: 0, totalScore: 0 }
      }

      if (className && type === 'count') {
        classesMap[className].count = parseFloat(value)
      }
      if (className && type === 'score') {
        classesMap[className].totalScore = parseFloat(value)
      }
    }

    const mainClasses = Object.entries(classesMap).map(([name, data]) => ({
      name,
      count: data.count,
      avgConfidence: data.count > 0 ? data.totalScore / data.count : 0
    }))

    // Parse Platforms
    const platforms: Record<string, Record<string, number>> = {}
    for (const [field, value] of Object.entries(platformStats)) {
      const lastColon = field.lastIndexOf(':')
      const platform = field.substring(0, lastColon)
      const className = field.substring(lastColon + 1)

      if (!platforms[platform]) platforms[platform] = {}
      platforms[platform][className] = parseInt(value)
    }

    // Parse Histogram
    const histogram: Record<string, number[]> = {}
    for (const [field, value] of Object.entries(histogramStats)) {
      const lastColon = field.lastIndexOf(':')
      const className = field.substring(0, lastColon)
      const bin = parseInt(field.substring(lastColon + 1))

      if (!histogram[className]) histogram[className] = Array(10).fill(0)
      histogram[className][bin] = parseInt(value)
    }

    return {
      job: {
        ...meta,
        total_comments: parseInt(meta.total_comments || '0'),
        processed_comments: parseInt(meta.processed_comments || '0'),
        status: meta.status
      },
      stats: {
        mainClasses,
        platforms,
        histogram
      }
    }
  }

  static async getComments(id: string, start: number, end: number): Promise<CommentData[]> {
    const redis = getRedisClient()
    if (!redis) return []

    const key = this.getJobKey(id)
    const raw = await redis.lrange(`${key}:comments`, start, end)
    return raw.map(r => JSON.parse(r) as CommentData)
  }

  static async getAnalyzedResults(id: string, start: number, end: number): Promise<SingleResult[]> {
    const redis = getRedisClient()
    if (!redis) return []

    const key = this.getJobKey(id)
    // lrange is inclusive
    const raw = await redis.lrange(`${key}:results`, start, end)
    return raw.map(r => JSON.parse(r) as SingleResult)
  }

  static async processJob(id: string) {
    console.log(`Starting background processing for job ${id}`)

    try {
      const job = await this.getJob(id)
      if (!job) return

      if (job.status === 'completed' || job.status === 'failed') return

      await this.updateJobStatus(id, 'processing')

      let currentOffset = job.processed_comments
      const total = job.total_comments

      while (currentOffset < total) {

        const endOffset = Math.min(currentOffset + BATCH_SIZE - 1, total - 1)
        const comments = await this.getComments(id, currentOffset, endOffset)

        if (comments.length === 0) break

        // FIXME: get the actual client language
        const apiLang = 'ar'
        const response = await AIService.analyzeBatch(comments, apiLang)

        await this.saveResults(id, response.results)

        currentOffset += comments.length
        await this.updateJobStatus(id, 'processing', currentOffset)

        await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS))
      }

      await this.updateJobStatus(id, 'completed', total)
      console.log(`Job ${id} completed`)

    } catch (error: any) {
      console.error(`Job ${id} failed:`, error)
      const redis = getRedisClient()
      if (redis) {
        const key = this.getJobKey(id)
        await redis.hset(`${key}:meta`, {
          status: 'failed',
          error: error.message || 'Unknown error'
        })
      }
    }
  }
}
