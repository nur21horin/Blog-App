import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


interface UserInfo {
  name: string;
  email: string;
  password: string;
}

export const resolvers = {
  Query: {
    me: async (parent: any, args: any, context: any) => {
      return await prisma.user.findMany();
    },
    posts: async (parent: any, args: any, context: any) => {
      return await prisma.post.findMany();
    },
  },
  Mutation: {
    signup: async (parent: any, args: UserInfo, context: any) => {
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      const token = jwt.sign({ userId: newUser.id }, "signature", {
        expiresIn: "1d",
      });
      return { token };
    },
    signin: async (parent: any, args: UserInfo, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });
      
      if (!user) {
       return{
        token: null
       }
      }
      const correctPassword = await bcrypt.compare(args.password, user?.password || "");
      if (!correctPassword) {
        return {
          token: null,
        };
      }
  },
};
