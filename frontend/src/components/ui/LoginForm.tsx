"use client";

import axiosInstanceLocal from "@/utils/axios/axiosInstanceLocal";
import { loginValidationSchema } from "@/utils/form_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage, { AleartMessageProps } from "./AlertMessage";

interface FormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<AleartMessageProps>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(loginValidationSchema),
  });
  const router = useRouter();
  const { data: session, status } = useSession();

  const searchParams = useSearchParams();
  const next_auth_error = searchParams.get("error");

  useEffect(() => {
    if (status === "authenticated") {
      const saveUserToken = async () => {
        await axiosInstanceLocal.post("/api/auth/user/add", {
          user_id: session?.info._id,
          email: session?.info.email,
          accessToken: session.accessToken,
          refreshToken: session.refreshToken,
        });
      };
      // save user info on database
      saveUserToken();

      setIsLoading(false);
      router.push("/");
    }
    if (next_auth_error) {
      setMessage({
        type: "error",
        text: next_auth_error,
      });
    }
  }, [status, router, next_auth_error, session]);

  const onSubmit = async (body: FormData) => {
    setIsLoading(true);
    const { email, password } = body;
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
      .then((res) => {
        if (res?.status === 401) {
          setMessage({
            type: "error",
            text: res.error as string,
          });
        }
        setIsLoading(false);
      })
      .catch((err) => {
        if (err?.data?.message) {
          setMessage({
            type: "error",
            text: err?.data?.message,
          });
        }
        setIsLoading(false);
      });
  };

  return (
    <div>
      {message && <AlertMessage type={message.type} text={message.text} />}

      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-2">
          <label className=" w-full block capitalize">Email</label>
          <input
            className="w-full px-2 py-1 outline-none border border-gray-400 rounded-md"
            type="text"
            {...register("email")}
          />
          {errors.email?.message && (
            <p className=" text-red-400">{errors.email?.message}</p>
          )}
        </div>
        <div className="my-2">
          <label className=" w-full block capitalize">Password</label>
          <input
            className="w-full px-2 py-1 outline-none border border-gray-400 rounded-md"
            type="password"
            {...register("password")}
          />
          {errors.password?.message && (
            <p className=" text-red-400">{errors.password?.message}</p>
          )}
        </div>

        <div className="mt-8 ">
          <button
            className="w-full capitalize py-1 text-center rounded-md bg-sky-500 text-white flex items-center justify-center"
            type="submit"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Loading...</span>
              </>
            ) : (
              <span>Login</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
