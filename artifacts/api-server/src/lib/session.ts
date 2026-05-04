import session from "express-session";
import type { RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { pool } from "@workspace/db";

declare module "express-session" {
  interface SessionData {
    utilisateurId?: number;
  }
}

const SECRET_SESSION =
  process.env.SESSION_SECRET ?? "dev-fallback-secret-change-me";

const PgStore = connectPg(session);

export const sessionMiddleware: RequestHandler = session({
  store: new PgStore({
    pool,
    tableName: "session",
    createTableIfMissing: false,
  }),
  secret: SECRET_SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
});
