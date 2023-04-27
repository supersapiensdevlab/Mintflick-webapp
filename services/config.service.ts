export const REDIS_CONFIG = {
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  port: process.env.REDIS_PORT || 6379,
};

export const MONGO_CONFIG = {
  host: process.env.ATLAS_URI || "",
};

export const MIDDLEWARE_CONFIG = {
  JWT_SECRET: process.env.JWT_SECRET || "",
}