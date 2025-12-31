import { PrismaClient } from "../generated/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const isProduction = process.env.NODE_ENV === "production";

const pool = new Pool({
  connectionString,
  // In production (Render/Supabase), the database requires SSL. We enable TLS
  // at the driver level and allow self-signed/managed certificates by not
  // rejecting unauthorized certs. Locally, we typically connect without SSL.
  ssl: isProduction ? { rejectUnauthorized: false } : false,
});

const adapter = new PrismaPg(pool);

export const prisma = new PrismaClient({ adapter });