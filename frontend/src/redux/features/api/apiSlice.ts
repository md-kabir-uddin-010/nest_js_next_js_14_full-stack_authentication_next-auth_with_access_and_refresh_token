import { RootState } from "@/redux/store";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLogout } from "../auth/authSlice";

// BaseQuery Function
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  prepareHeaders: async (headers, { getState }) => {
    const accessToken = (getState() as RootState)?.auth?.accessToken;
    // set authorization token on header
    if (accessToken) {
      headers.set("Authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

//  Create API Slice
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result?.error?.status === 401) {
      api.dispatch(userLogout);
      localStorage.clear();
    }

    return result;
  },
  endpoints: (builder) => ({}),
});
