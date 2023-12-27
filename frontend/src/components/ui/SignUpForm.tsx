"use client";

import { useRegisterMutation } from "@/redux/features/auth/authApi";
import { signUpValidationSchema } from "@/utils/form_validation";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import AlertMessage, { AleartMessageProps } from "./AlertMessage";

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function SignUpForm() {
  const [message, setMessage] = useState<AleartMessageProps>();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(signUpValidationSchema),
  });

  const [userRegister, { isLoading }] = useRegisterMutation();

  useEffect(() => {}, []);

  const onSubmit = async (body: FormData) => {
    const { name, email, password } = body;
    await userRegister({
      name,
      email,
      password,
    })
      .unwrap()
      .then((res) => {
        if (res?.message) {
          setMessage({
            type: "success",
            text: res.message,
          });
        }
      })
      .catch((err) => {
        if (err?.data?.message) {
          setMessage({
            type: "error",
            text: err?.data?.message,
          });
        }
      });
  };

  const handleGoogleLogin = async () => {
    window.open(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user/google/login`,
      "_self"
    );
  };

  return (
    <div className=" w-96 mt-8 mx-auto shadow-md border border-gray-100 rounded-lg px-4 py-8">
      <h1 className="mb-4 text-2xl font-bold text-center">Signup Form</h1>
      {message && <AlertMessage type={message.type} text={message.text} />}

      <form action="#" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="my-2">
          <label className=" w-full block capitalize">Name</label>
          <input
            className="w-full px-2 py-1 outline-none border border-gray-400 rounded-md"
            type="text"
            {...register("name")}
          />
          {errors.name?.message && (
            <p className=" text-red-400">{errors.name?.message}</p>
          )}
        </div>
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
        <div className="my-2">
          <label className=" w-full block capitalize">Confirm Password</label>
          <input
            className="w-full px-2 py-1 outline-none border border-gray-400 rounded-md"
            type="password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword?.message && (
            <p className=" text-red-400">{errors.confirmPassword?.message}</p>
          )}
        </div>
        <div className="mt-8 ">
          {isLoading ? (
            <button
              type="button"
              className=" w-full inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-sky-500 hover:bg-sky-500  transition ease-in-out duration-150 cursor-not-allowed"
              disabled={true}
            >
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
              Processing...
            </button>
          ) : (
            <button
              className="w-full capitalize py-1 text-center rounded-md bg-sky-500 text-white"
              type="submit"
            >
              sign up
            </button>
          )}
        </div>

        <div className=" my-2">
          <p className="text-center">
            Already have an account?{" "}
            <Link
              className=" capitalize text-sky-400 underline"
              href={"/user/login"}
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>

      <div className=" text-center">
        <button
          type="button"
          onClick={handleGoogleLogin}
          className=" w-full border border-gray-300 px-2 py-1 rounded-md my-3 text-center capitalize text-lg shadow-sm "
        >
          Signup with Google
        </button>
      </div>
    </div>
  );
}
