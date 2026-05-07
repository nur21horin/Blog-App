import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jswtHelper } from "../utilis/jwtHealper.js";


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
      const isExit=await prisma.user.findFirst({
        where:{email:args.email}
      })
      if(isExit){
        return {
          userError: "User already exists",
          token: null
        }
      }
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      const token = await jswtHelper({ userId: newUser.id });
      return {
        userError: null,
         token
         };
    },
    signin: async (parent: any, args: UserInfo, context: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });
      
      if (!user) {
       return{
          userError: "User not found",
        token: null
       }
      }
      const correctPassword = await bcrypt.compare(args.password, user?.password || "");
      if (!correctPassword) {
        return {
          userError: "Invalid password",
          token: null,
        };
      }
      const token =  await jswtHelper({ userId: newUser.id });
      return {
        userError: null,
        token };
    },
  },
};
