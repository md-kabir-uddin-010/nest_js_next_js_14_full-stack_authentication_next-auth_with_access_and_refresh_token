"use client";

import axiosInstance from "@/utils/axios/axiosInstance";
import axiosInstanceLocal from "@/utils/axios/axiosInstanceLocal";
import { HideNavbarForThisPages } from "@/utils/navbar";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: session } = useSession();

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

  const logoutUser = async (token: string) => {
    await axiosInstance.post("/api/auth/user/logout", {
      token,
    });
  };

  const deleteUserToken = async (id: string) => {
    await axiosInstanceLocal.delete(`/api/auth/user/delete?user_id=${id}`);
  };

  const hadleLogout = async () => {
    const { refreshToken } = await getUserData(session?.info._id as string);
    await deleteUserToken(session?.info._id as string);
    await logoutUser(refreshToken);
    await signOut({ redirect: false });
    router.push("/user/login");
  };

  return (
    <>
      {!HideNavbarForThisPages.includes(pathname) ? (
        <ul className=" bg-sky-500 px-2 py-2 flex items-center justify-between">
          <li>
            <Link className="text-white" href={"/"}>
              Home
            </Link>
          </li>
          {session?.accessToken ? (
            <>
              <li>
                <Link className="text-white" href={"/blog"}>
                  Blog
                </Link>
              </li>
              <button
                onClick={hadleLogout}
                className="text-white hover:bg-slate-600 rounded-sm px-1 py-1"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <li>
                <Link className="text-white" href={"/user/login"}>
                  Login
                </Link>
              </li>
              <li>
                <Link className="text-white" href={"/user/signup"}>
                  Sign Up
                </Link>
              </li>
            </>
          )}
        </ul>
      ) : null}
    </>
  );
}
