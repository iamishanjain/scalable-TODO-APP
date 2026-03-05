import { port } from "./config";
import Logger from "./core/logger";
import "./database/index";
import app from "./app";

const PORT = port ?? 8080;

app
  .listen(PORT, () => {
    Logger.info(`Server is running on port ${PORT}`);
  })
  .on("error", (e) => {
    Logger.error("Error in starting the app " + e);
  });
