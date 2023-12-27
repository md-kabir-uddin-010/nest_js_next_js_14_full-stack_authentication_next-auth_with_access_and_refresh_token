"use client";

import { useVerifyAccountMutation } from "@/redux/features/auth/authApi";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AlertMessage, { AleartMessageProps } from "./AlertMessage";

type Props = {
  verificationToken: string | string[] | undefined;
};

export default function AccountVerifyButton({ verificationToken }: Props) {
  const [message, setMessage] = useState<AleartMessageProps>();
  const [verifyAccount, { isLoading }] = useVerifyAccountMutation();
  const router = useRouter();

  const handleClick = async () => {
    if (verificationToken) {
      await verifyAccount({
        token: verificationToken,
      })
        .unwrap()
        .then((res) => {
          if (res) {
            router.replace("/");
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
    }
  };

  return (
    <>
      {message && <AlertMessage type={message.type} text={message.text} />}

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
            onClick={handleClick}
            className="bg-sky-500 px-4 py-1 rounded-md text-white font-semibold text-lg"
          >
            Verify Your Account
          </button>
        )}
      </div>
    </>
  );
}
