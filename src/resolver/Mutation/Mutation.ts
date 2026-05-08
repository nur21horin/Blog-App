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
  signup: async (parent: any, args: UserInfo, { prisma }: any) => {
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
    const token = await jswtHelper.generateToken(
      { userId: newUser.id },
      config.secret,
    );
    return {
      userError: null,
      token,
    };
  },
  signin: async (parent: any, args: UserInfo, { prisma }: any) => {
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
    const token = await jswtHelper.generateToken(
      { userId: user.id },
      config.secret,
    );
    return {
      userError: null,
      token,
    };
  },
  addPost: async (parent: any, { post }: any, { prisma, userInfo }: any) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }
    if (!post.title || !post.content) {
      return {
        userError: "Title and content are required",
        post: null,
      };
    }
    const newPost = await prisma.post.create({
      data: {
        title: post.title,
        content: post.content,
        authorId: userInfo.userId,
      },
    });
    return {
      userError: null,
      post: newPost,
    };
  },
  updatePost: async (
    parent: any,
    { id, post }: any,
    { prisma, userInfo }: any,
  ) => {
    if (!userInfo) {
      return {
        userError: "Unauthorized",
        post: null,
      };
    }

    const existingPost = await prisma.post.findUnique({
      where: { id: Number(id) },
    });
    if (!existingPost) {
      return {
        userError: "Post not found",
        post: null,
      };
    }

    if (existingPost.authorId !== userInfo.userId) {
      return {
        userError: "You can only update your own posts",
        post: null,
      };
    }

    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title: post.title ?? existingPost.title,
        content: post.content ?? existingPost.content,
      },
    });
    return {
      userError: null,
      post: updatedPost,
    };
  },
};
