import mongoose from "mongoose";

import { db, environment } from "../config";
import Logger from "../core/logger";

const dbURI = db.DB_URI;

const options: mongoose.ConnectOptions = {
  autoIndex: environment !== "production", // disable in production for performance
  maxPoolSize: db.maxPoolSize,
  minPoolSize: db.minPoolSize,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  serverSelectionTimeoutMS: 5000,
};

Logger.debug(dbURI);

function setRunValidators() {
  return { runValidators: true };
}

mongoose.set("strictQuery", true);

mongoose
  .plugin((schema: any) => {
    schema.pre("findOneAndUpdate", setRunValidators);
    schema.pre("updateMany", setRunValidators);
    schema.pre("updateOne", setRunValidators);
    schema.pre("update", setRunValidators);
  })
  .connect(dbURI as string, options)
  .then(() => {
    Logger.info("Mongoose connected successfully");
  })
  .catch((e) => {
    Logger.info("Error in connecting to mongoose");
    Logger.error(e);
  });

mongoose.connection.on("connected", () => {
  Logger.info("Mongoose connection established");
});

mongoose.connection.on("error", (err) => {
  Logger.error(`Mongoose connection error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  Logger.warn("Mongoose connection disconnected");
});

process.on("SIGINT", () => {
  mongoose.connection.close().finally(() => {
    Logger.info(
      "Mongoose default connection terminated beacuse of app termination",
    );
    process.exit(0);
  });
});

export const connection = mongoose.connection;

// import mongoose from "mongoose";

// import { db, environment } from "../config";
// import Logger from "../core/logger";

// const MAX_RETRY_ATTEMPTS = 5;
// const RETRY_BASE_DELAY_MS = 3000;

// const options: mongoose.ConnectOptions = {
//   autoIndex: environment !== "production", // disable in production for performance
//   maxPoolSize: db.maxPoolSize,
//   minPoolSize: db.minPoolSize,
//   connectTimeoutMS: 10000,
//   socketTimeoutMS: 45000,
//   serverSelectionTimeoutMS: 5000,
// };

// function setRunValidators() {
//   return { runValidators: true };
// }

// mongoose.set("strictQuery", true);

// mongoose.plugin((schema: any) => {
//   schema.pre("findOneAndUpdate", setRunValidators);
//   schema.pre("updateMany", setRunValidators);
//   schema.pre("updateOne", setRunValidators);
//   schema.pre("update", setRunValidators);
// });

// // --- Connection event listeners ---

// mongoose.connection.on("connected", () => {
//   Logger.info("Mongoose connection established");
// });

// mongoose.connection.on("error", (err) => {
//   Logger.error(`Mongoose connection error: ${err.message}`);
// });

// mongoose.connection.on("disconnected", () => {
//   Logger.warn("Mongoose connection disconnected");
// });

// // --- Retry-based connect function ---

// async function connectWithRetry(attempt = 1): Promise<void> {
//   const dbURI = db.DB_URI;

//   if (!dbURI) {
//     throw new Error("DB_URI is not defined in environment variables");
//   }

//   // Log a masked URI to avoid leaking credentials
//   const maskedURI = dbURI.replace(
//     /\/\/([^:]+):([^@]+)@/,
//     "//***:***@",
//   );
//   Logger.debug(`Attempting DB connection (attempt ${attempt}): ${maskedURI}`);

//   try {
//     await mongoose.connect(dbURI, options);
//   } catch (err) {
//     if (attempt >= MAX_RETRY_ATTEMPTS) {
//       Logger.error(
//         `Failed to connect to MongoDB after ${MAX_RETRY_ATTEMPTS} attempts. Shutting down.`,
//       );
//       throw err;
//     }

//     const delay = RETRY_BASE_DELAY_MS * Math.pow(2, attempt - 1); // exponential backoff
//     Logger.warn(
//       `MongoDB connection attempt ${attempt} failed. Retrying in ${delay / 1000}s...`,
//     );
//     await new Promise((resolve) => setTimeout(resolve, delay));
//     return connectWithRetry(attempt + 1);
//   }
// }

// // --- Graceful shutdown ---

// async function gracefulShutdown(signal: string): Promise<void> {
//   Logger.info(`${signal} received — closing MongoDB connection`);
//   try {
//     await mongoose.connection.close();
//     Logger.info("MongoDB connection closed gracefully");
//   } catch (err) {
//     Logger.error("Error during MongoDB disconnect", err);
//   } finally {
//     process.exit(0);
//   }
// }

// process.on("SIGINT", () => gracefulShutdown("SIGINT"));
// process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// export const connection = mongoose.connection;
// export default connectWithRetry;
