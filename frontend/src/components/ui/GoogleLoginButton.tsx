"use client";
import { signIn } from "next-auth/react";

export default function GoogleLoginButton() {
  const handleClick = async () => {
    await signIn("google", {
      // redirect: false,
    })
      .then((res) => {
        console.log({ res });
      })
      .catch((err) => {
        // console.log({ err });
      });
  };
  return (
    <div>
      <button
        onClick={handleClick}
        className="w-full capitalize border border-gray-300 px-2 py-2 rounded-md hover:bg-gray-100 transition-all "
      >
        login with google
      </button>
    </div>
  );
}
