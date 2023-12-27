"use client";

import { userLogin } from "@/redux/features/auth/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type Props = {};

export default function GoogleLoginPage({}: Props) {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const accessToken = searchParams.get("_act");
  const refreshToken = searchParams.get("_reft");
  const userInfo = searchParams.get("_info");

  useEffect(() => {
    if (accessToken && refreshToken && userInfo) {
      localStorage.setItem(
        "auth",
        JSON.stringify({
          accessToken,
          refreshToken,
          userInfo,
        })
      );

      const payload = {
        accessToken,
        refreshToken,
        userInfo,
      };
      dispatch(userLogin(payload));
      router.replace("/");
    }
  }, [accessToken, refreshToken, userInfo, dispatch, router]);

  return (
    <div>
      <p className=" w-full min-h-screen flex items-center justify-center">
        Google Login Successfull!
      </p>
    </div>
  );
}
