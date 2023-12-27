import "next-auth";

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    info: {
      _id: string;
      name: string;
      email: string;
      password: string;
      profile_pic: string;
      account_status: string;
      signup_strategy: string;
      user_role: string;
      email_verified: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }

  interface Session {
    accessToken: string;
    refreshToken: string;
    info: {
      _id: string;
      name: string;
      email: string;
      password: string;
      profile_pic: string;
      account_status: string;
      signup_strategy: string;
      user_role: string;
      email_verified: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }
}

import "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    info: {
      _id: string;
      name: string;
      email: string;
      password: string;
      profile_pic: string;
      account_status: string;
      signup_strategy: string;
      user_role: string;
      email_verified: boolean;
      createdAt: string;
      updatedAt: string;
      __v: number;
    };
  }
}
