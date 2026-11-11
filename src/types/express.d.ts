import type { IUser } from "../models/user.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}

export {};
