"use client";
import Link from "next/link";

export default function SignUpRoute() {
  return (
    <div className=" mt-8 my-2">
      <p className="text-center">
        Already have an account?{" "}
        <Link
          className=" capitalize text-sky-400 underline"
          href={"/user/signup"}
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
