import mongoose from "mongoose";
import { MONGO_CONFIG } from "./config.service";

export const conn = async () =>
  mongoose
    .connect(MONGO_CONFIG.host, {
      keepAlive: true,
      keepAliveInitialDelay: 300000,
    })
    .then(() => {
      console.log("Database Connected Sucessfully !");
    })
    .catch((err: any) => {
      console.log("Error Connecting Database !");
    });
