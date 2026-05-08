import { prisma } from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jswtHelper } from "../utilis/jwtHealper.js";
import config from "../config/index.js";
import { Query } from "./Query/Query.js";
import { Mutation } from "./Mutation/Mutation.js";


export const resolvers = {
  Query,
  Mutation,
};
