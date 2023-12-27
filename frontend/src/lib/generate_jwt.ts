import jwt from "jsonwebtoken";

export type Payload = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export const generateOAuthToken = (payload: Payload) => {
  try {
    const token = jwt.sign(payload, process.env.OAUTH_JWT_SECRET as string, {
      expiresIn: process.env.OAUTH_TOKEN_EXPIRESIN,
      issuer: process.env.OAUTH_TOKEN_ISSUER,
    });
    return token;
  } catch (error) {
    throw error;
  }
};
