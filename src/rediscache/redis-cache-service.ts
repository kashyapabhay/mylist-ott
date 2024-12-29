import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';
import { RedisNotEnabledException } from './redis.not.enabled.exception';

@Injectable()
export class RedisCacheService {
    private client: RedisClientType;
    private readonly enableRedisCache: boolean;
    private readonly redisUrl: string;
    constructor() {
        this.enableRedisCache = process.env.ENABLE_REDIS_CACHE === 'true' || false; // Default to false if not set
        this.redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'; // Default to localhost if not set
    }
    async onModuleInit() {
        if (this.enableRedisCache) {
            console.log('Connecting to Redis...');
            this.client = createClient({
                url: this.redisUrl,
            });
            await this.client.connect();
        } else {
            console.log('Redis cache is disabled.');
        }
    }

    async onModuleDestroy() {
        await this.client.disconnect();
    }

    async get(key: string): Promise<any> {
        if (this.enableRedisCache === false) {
            throw new RedisNotEnabledException("Redis not enabled");
        }
        const value = await this.client.get(key);
        return value ? JSON.parse(value) : null;
    }

    async put(key: string, value: any, ttl: number): Promise<void> {
        if (this.enableRedisCache === false) {
            throw new RedisNotEnabledException("Redis not enabled");
        }
        await this.client.set(key, JSON.stringify(value), {
            EX: ttl,
        });
    }
}