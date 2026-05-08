
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jswtHelper } from "../utilis/jwtHealper.js";
import config from "../config/index.js";


interface UserInfo {
  name: string;
  email: string;
  password: string;
  bio?: string;
}

export const Mutation = {
    signup: async (parent: any, args: UserInfo, {prisma}: any) => {
      const isExit = await prisma.user.findFirst({
        where: { email: args.email },
      });
      if (isExit) {
        return {
          userError: "User already exists",
          token: null,
        };
      }
      const hashedPassword = await bcrypt.hash(args.password, 10);
      const newUser = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });
      if (args.bio) {
        await prisma.profile.create({
          data: {
            bio: args.bio,
            userId: newUser.id,
          },
        });
      }
      const token = await jswtHelper({ userId: newUser.id }, config.secret);
      return {
        userError: null,
        token,
      };
    },
    signin: async (parent: any, args: UserInfo, {prisma}: any) => {
      const user = await prisma.user.findFirst({
        where: { email: args.email },
      });

      if (!user) {
        return {
          userError: "User not found",
          token: null,
        };
      }
      const correctPassword = await bcrypt.compare(
        args.password,
        user?.password || "",
      );
      if (!correctPassword) {
        return {
          userError: "Invalid password",
          token: null,
        };
      }
      const token = await jswtHelper({ userId: user.id }, config.secret);
      return {
        userError: null,
        token,
      };
    },
    addPost: async (parent: any, args: any, { prisma}: any) => {
      if (!userId) {
        return {
          userError: "Unauthorized",
          post: null,
        };
      }
    
  },