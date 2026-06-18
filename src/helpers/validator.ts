import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequesError } from "../core/customError";

export enum ValidationSource {
  BODY = "body",
  QUERY = "query",
  PARAMS = "params",
  HEADERS = "headers",
}

const validateRequest = (
  schema: ZodSchema,
  source: ValidationSource = ValidationSource.BODY,
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = schema.parse(req[source]);
      Object.assign(req[source], data);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const message = error.issues
          .map((issue) => `${issue.path.join(".")} - ${issue.message}`)
          .join(", ");
        return next(new BadRequesError(message));
      }
      next(error);
    }
  };
};
export { validateRequest };
