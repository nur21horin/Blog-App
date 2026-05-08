import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";
import { DefaultArgs } from "@prisma/client/runtime/library.js";



const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("Missing DATABASE_URL in environment (.env)");
}

const adapter = new PrismaPg({ connectionString: databaseUrl });

export const prisma = new PrismaClient({
  adapter,
});

