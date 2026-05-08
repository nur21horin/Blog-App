import "dotenv/config";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolver/index.js";
import { prisma } from "./lib/prisma.js";
import type { PrismaClient, Prisma } from "./generated/prisma/client.js";
import type { DefaultArgs } from "@prisma/client/runtime/library.js";

interface Context {
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
}

const main = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async (): Promise<Context> => {
      return {
        prisma,
      };
    },
  });

  console.log(`🚀  Server ready at: ${url}`);
};

main();
