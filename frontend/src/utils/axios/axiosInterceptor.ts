import { authOptions } from "@/lib";
import axios from "axios";
import { getServerSession } from "next-auth";
import axiosInstance from "./axiosInstance";
import axiosInstanceLocal from "./axiosInstanceLocal";
import isExpired from "./jwtIsExpired";

const axios_interceptor = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const getUserData = async (user_id: string) => {
  try {
    const { data } = await axiosInstanceLocal.get(
      `/api/auth/user/get?user_id=${user_id}`
    );
    return {
      accessToken: data?.user?.access_token,
      refreshToken: data?.user?.refresh_token,
    };
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
    };
  }
};

const refreshUserToken = async (token: string) => {
  try {
    const { data } = await axiosInstance.post("/api/auth/user/token/refresh", {
      token,
    });
    return {
      accessToken: data?.accessToken,
      refreshToken: data?.refreshToken,
      info: data?.info,
    };
  } catch (error) {
    return {
      accessToken: null,
      refreshToken: null,
      info: null,
    };
  }
};

const updateUserToken = async (
  id: string,
  email: string,
  accessToken: string,
  refreshToken: string
) => {
  try {
    await axiosInstanceLocal.post("/api/auth/user/add", {
      user_id: id,
      email,
      accessToken,
      refreshToken,
    });
    return true;
  } catch (error) {
    return false;
  }
};

axios_interceptor.interceptors.request.use(
  async (req) => {
    const session = await getServerSession(authOptions);
    const { accessToken, refreshToken } = await getUserData(
      session?.info._id as string
    );

    if (accessToken) {
      req.headers.Authorization = `Bearer ${accessToken}`;
    }

    if (accessToken) {
      const expired = isExpired(accessToken);
      if (expired) {
        const refreshedData = await refreshUserToken(refreshToken);

        const updated = await updateUserToken(
          session?.info._id as string,
          session?.info.email as string,
          refreshedData.accessToken,
          refreshedData.refreshToken
        );

        if (updated && refreshedData.accessToken) {
          req.headers.Authorization = `Bearer ${refreshedData?.accessToken}`;
        }
      }
    }

    return req;
  },
  (err) => Promise.reject(err)
);

export default axios_interceptor;
