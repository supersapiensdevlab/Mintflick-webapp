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
};

export const LIVEPEER_CONFIG = {
  livepeerkey: process.env.LIVEPEER_KEY || "",
};

export const CREATE_ROOM_CONFIG = {
  xApikey: process.env.CREATE_ROOM_API || "",
};

export const SENDGRID_CONFIG = {
  apiKey: process.env.SENDGRID_API || "",
  serviceEmail: process.env.SERVICE_EMAIL || "",
};
