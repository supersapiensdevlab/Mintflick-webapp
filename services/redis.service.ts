import Redis from 'ioredis';
import { REDIS_CONFIG } from './config.service';

export class RedisService {
    private cache: any;
    private redis = new Redis({
        port: Number(REDIS_CONFIG.port), // Redis port
        host: REDIS_CONFIG.host, // Redis host
        username: REDIS_CONFIG.username, // needs Redis >= 6
        password: REDIS_CONFIG.password,
        db: 0, // Defaults to 0
      });
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    constructor() {
      this.cache = this.redis;
    }
  
    async get(key: string): Promise<string> {
      return new Promise((resolve, reject) => {
        this.cache.get(key, (err: any, reply: string | PromiseLike<string>) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(reply);
        });
      });
    }
  
    async keys(pattern: string): Promise<string[]> {
      return new Promise((resolve, reject) => {
        this.cache.keys(pattern, (err: any, keys: string[]) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(keys);
        });
      });
    }
  
    async ttl(key: string): Promise<number> {
      return new Promise((resolve, reject) => {
        this.cache.ttl(key, (err: any, reply: number | PromiseLike<number>) => {
          if (err) {
            reject(err);
          }
          resolve(reply);
        });
      });
    }
  
    async flush(): Promise<string> {
      return new Promise((resolve, reject) => {
        this.cache.flushall((err: any, reply: string | PromiseLike<string>) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(reply);
        });
      });
    }
  
    async set(
      key: string,
      value: string | boolean,
      ttl?: number,
    ): Promise<string | boolean> {
      return new Promise((resolve, reject) => {
        const args: any = [key, value];
        if (ttl && ttl > 0) {
          args.push('PX');
          args.push(ttl);
        }
        this.cache.set(...args, (err: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(value);
        });
      });
    }
  
    async setex(
      key: string,
      value: string | boolean,
      ttl: number,
    ): Promise<string | boolean> {
      return new Promise((resolve, reject) => {
        const args: any = [key, ttl, value];
        this.cache.setex(...args, (err: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(value);
        });
      });
    }
  
    async delete(key: string): Promise<boolean | number> {
      return new Promise((resolve, reject) => {
        this.cache.del(key, (err: any, reply: number) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(reply);
        });
      });
    }
  
    async deletePattern(
      pattern: string,
    ): Promise<{ count: number; keys: string[] }> {
      const startTime = Date.now();
      const keys = await this.keys(pattern);
      const keyScanEndTime = Date.now();
      console.log(
        `${keys.length} found for pattern: ${pattern} in ${
          (keyScanEndTime - startTime) / 1000
        } seconds`,
      );
      if (!keys.length) {
        return { count: 0, keys: [] };
      }
      const batchSize = 10000;
      for (let i = 0; i < keys.length; i += batchSize) {
        const start = i;
        const end = Math.min(i + batchSize, keys.length);
        console.log(
          `Deleting ${
            end - start
          } keys from index ${start} to ${end} for pattern ${pattern}`,
        );
        const keysBatch = keys.slice(start, end);
        await new Promise((resolve, reject) => {
          this.cache.del(...keysBatch, (err: any, reply: number) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve({ count: reply, keys });
          });
        });
      }
      const delEndTime = Date.now();
      console.log(
        `${keys.length} deleted for pattern ${pattern} deleted in ${
          (delEndTime - startTime) / 1000
        } seconds`,
      );
      return { count: keys.length, keys };
    }
  
    async sadd(
      key: string,
      value: string | boolean,
      ttl?: number,
    ): Promise<string | boolean> {
      return new Promise((resolve, reject) => {
        const args: any = [key, value];
        this.cache.sadd(...args, (err: any, result: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          this.cache.expire(key, ttl, (err: any) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve(result);
          });
        });
      });
    }
  
    async scard(key: string): Promise<number | boolean> {
      return new Promise((resolve, reject) => {
        this.cache.scard(key, (err: any, result: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(result);
        });
      });
    }
  
    async smembers(key: string): Promise<string[]> {
      return new Promise((resolve, reject) => {
        this.cache.smembers(key, (err: any, result: any) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve(result);
        });
      });
    }
  }