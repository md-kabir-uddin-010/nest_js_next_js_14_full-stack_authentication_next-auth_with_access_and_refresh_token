import { apiSlice } from "../api/apiSlice";
import { userLogin } from "./authSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // signup user
    register: builder.mutation({
      query: (body) => ({
        url: "/api/auth/user/signup",
        method: "POST",
        body,
      }),
    }),

    // login user
    login: builder.mutation({
      query: (body) => ({
        url: "/api/auth/user/login",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result.data) {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                accessToken: result?.data?.accessToken,
                refreshToken: result?.data?.refreshToken,
                userInfo: result?.data?.info,
              })
            );

            dispatch(
              userLogin({
                accessToken: result?.data?.accessToken,
                refreshToken: result?.data?.refreshToken,
                userInfo: result?.data?.info,
              })
            );
          }
        } catch (error) {}
      },
    }),

    // login user
    verifyAccount: builder.mutation({
      query: (body) => ({
        url: "/api/auth/user/account/verify",
        method: "POST",
        body,
      }),

      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;

          if (result?.data) {
            localStorage.setItem(
              "auth",
              JSON.stringify({
                accessToken: result?.data?.accessToken,
                refreshToken: result?.data?.refreshToken,
                userInfo: result?.data?.info,
              })
            );

            dispatch(
              userLogin({
                accessToken: result?.data?.accessToken,
                refreshToken: result?.data?.refreshToken,
                userInfo: result?.data?.info,
              })
            );
          }
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyAccountMutation,
} = authApi;
