import type { Request } from "express";

declare interface ProtectedRequest extends Request {
  user?: any;
}
