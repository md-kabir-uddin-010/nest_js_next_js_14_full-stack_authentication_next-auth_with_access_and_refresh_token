export type JwtPayload = {
  id?: string;
  email?: string;
  isEmailVerification?: boolean;
  [key: string]: any;
};

export type JWTVerifyPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
  iss: string;
};
