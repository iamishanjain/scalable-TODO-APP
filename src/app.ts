import express, {
  NextFunction,
  Request,
  Response,
  type Application,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes";
import { corsUrl, environment, port } from "./config";
import todoRoutes from "./routes/todoRoutes";
import { errorHandler } from "./middlewares/errorMiddleware";
import Logger from "./core/logger";
import "./database/index";
import { ApiError, ErrorType } from "./core/apiError";
import { InternalError } from "./core/customError";

const app: Application = express();

app.use(cors({ origin: corsUrl, optionsSuccessStatus: 200 }));

app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/todo", todoRoutes);

app.use(errorHandler);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);

    if (err.type === ErrorType.INTERNAL) {
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
    } else {
      Logger.error(
        `500 - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`,
      );
      Logger.error(err.stack);

      if (environment === "development") {
        res.status(500).json({
          message: err.message,
          stack: err.stack,
        });
      }
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
