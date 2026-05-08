import { prisma } from "../../lib/prisma.js";

export const Query = {
    me: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
    posts: async (parent: any, args: any, context: any) => {
      return await prisma.post.findMany();
    },
  },