import mongoose from "mongoose";
import { MONGO_CONFIG } from "./config.service";

export const conn = mongoose.connect(MONGO_CONFIG.host, {
  keepAlive: true,
  keepAliveInitialDelay: 300000,
});

export const a1212 =1 ;