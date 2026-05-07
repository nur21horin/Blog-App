import jwt, { Secret } from "jsonwebtoken";
import config from "../config/index.js";
require("dotenv").config();


export const jswtHelper = async (payload:{userId:number},secret:Secret) =>{
  
  const token=jwt.sign(payload, config.jwt.Secret, {
      expiresIn: "1d",
    });
    return token;
  },
};