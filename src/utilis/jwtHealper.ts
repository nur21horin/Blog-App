import jwt, { Secret } from "jsonwebtoken";
import config from "../config/index.js";

export const jswtHelper = async (
  payload: { userId: number },
  secret: Secret,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: "1d",
  });
  return token;
};
