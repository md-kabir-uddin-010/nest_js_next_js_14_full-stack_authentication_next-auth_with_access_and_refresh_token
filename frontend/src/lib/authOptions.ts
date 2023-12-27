import { AxiosError } from "axios";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { generateOAuthToken } from ".";
import axiosInstance from "../utils/axios/axiosInstance";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/user/login",
    error: "/user/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Name",
          type: "text",
          placeholder: "Jone Doe",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };
          if (!email || !password) return null;

          const res = await axiosInstance.post("api/auth/user/login", {
            email,
            password,
          });

          return res.data;
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.code === "ECONNREFUSED") {
              throw new Error("Internal Server Error!");
            }
            // console.log({ err: error?.response?.data });
            throw new Error(error.response?.data?.message);
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    // OAuth Sign In And Handle A ctions
    async signIn({ account, user, profile }) {
      if (account?.provider === "google" && user && profile) {
        try {
          const { id, name, email, image } = user;
          if (id && name && email && image) {
            const token = generateOAuthToken({
              id,
              email,
              name,
              image,
            });
            const res = await axiosInstance.post(
              "/api/auth/user/oauth/google/login",
              {
                token: token,
              }
            );

            user.accessToken = res.data.accessToken;
            user.refreshToken = res.data.refreshToken;
            user.info = res.data.info;

            return true;
          }
        } catch (error) {
          if (error instanceof AxiosError) {
            if (error.code === "ECONNREFUSED") {
              throw new Error("Internal Server Error!");
            }
            // console.log({ err: error?.response?.data });
            throw new Error(error.response?.data?.message);
          }
          return false;
        }
      }
      return true;
    },

    //
    async jwt({ token, trigger, user, session }) {
      // client side session update
      if (
        trigger === "update" &&
        session?.accessToken &&
        session?.refreshToken &&
        session?.info
      ) {
        token.accessToken = session.accessToken;
        token.refreshToken = session.refreshToken;
        token.info = session.info;
      }

      if (user) {
        return { ...token, ...user };
      }

      return token;
    },

    //  The session receives the token from JWT
    async session({ token, session }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.info = token.info;

      return session;
    },
  },
};
