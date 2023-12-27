"use client";

import axios, { AxiosError } from "axios";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

function Home() {
  const { data: session, status, update } = useSession();

  // console.log({ session });

  const router = useRouter();

  const handleSessionUpdate = () => {
    // update({
    //   accessToken:
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2U0NDM4MDY1MWI1NWNhNjc5NjIyOSIsImVtYWlsIjoic2trYWJpcmlzbGFtMjJAZ21haWwuY29tIiwiaWF0IjoxNzAyODU5MDY1LCJleHAiOjE3MDI4NjI2NjUsImlzcyI6IlNrIGthYmlyIElzbGFtIn0.5yZfDrz9utcC9A7a8ifJDL5_ayjUVedmam8brl3DAt0 update",
    //   refreshToken:
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1N2U0NDM4MDY1MWI1NWNhNjc5NjIyOSIsImVtYWlsIjoic2trYWJpcmlzbGFtMjJAZ21haWwuY29tIiwiaWF0IjoxNzAyODU5MDY1LCJleHAiOjE3MDI5NDU0NjUsImlzcyI6IlNrIGthYmlyIElzbGFtIn0.r41FWPFpIV-ZV111kFIGBtCt2KhFUK5-rUX0O9jQT6g update",
    //   info: {
    //     _id: "657e44380651b55ca6796229",
    //     name: "Sk kabir islam update",
    //     email: "skkabirislam22@gmail.com",
    //     password:
    //       "$2b$10$wCKaN6XExvRgYNRMFiXKW.uP1EKE0DB9OMlNZ1Ru1Ri5KnleyAJFG",
    //     profile_pic: "default.png",
    //     account_status: "APPROVAL_PENDING",
    //     signup_strategy: "EMAIL",
    //     user_role: "USER",
    //     email_verified: true,
    //     createdAt: "2023-12-17T00:43:36.729Z",
    //     updatedAt: "2023-12-17T00:43:36.729Z",
    //     __v: 0,
    //   },
    // });
  };

  const handleLogOut = async () => {
    await signOut({
      redirect: false,
    });
    router.push("/user/login");
  };

  const setCookie = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/auth/token/set",
        {
          accessToken: "adsfasdffa",
          refreshToken: "adsfasdffa",
          info: {
            name: "adsfasdffa",
          },
        }
      );
      console.log("set cookie", { data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };
  const getCookie = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:3000/api/auth/token/get"
      );
      console.log("get cookie", { data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };
  const updateCookie = async () => {
    try {
      const { data } = await axios.put(
        "http://localhost:3000/api/auth/token/update",
        {
          accessToken: "update",
          refreshToken: "update",
          info: {
            name: "update",
          },
        }
      );

      console.log("update cookie", { data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };
  const deleteCookie = async () => {
    try {
      const { data } = await axios.delete(
        "http://localhost:3000/api/auth/token/delete"
      );

      console.log("delete cookie", { data });
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data);
      }
    }
  };

  return (
    <main className="">
      <div className="">Name :{session?.info?.name} </div>
      <div className="">Email :{session?.info?.email} </div>
      <br />
      <div className=" max-w-6xl">accessToken :{session?.accessToken} </div>
      <br />
      <br />
      <div className=" max-w-6xl">refreshToken :{session?.refreshToken} </div>
      <br />

      <div className="mt-5">
        <button
          className=" capitalize bg-green-400 text-white px-4 py-1 rounded-md mx-2"
          onClick={handleSessionUpdate}
        >
          update session
        </button>
        <button
          className=" capitalize bg-red-400 text-white px-4 py-1 rounded-md mx-2"
          onClick={handleLogOut}
        >
          log out
        </button>
      </div>

      <div className=" mt-4">
        <button
          onClick={setCookie}
          className="m-2 bg-indigo-500 p-2 rounded-md text-white"
        >
          set cookie
        </button>
        <button
          onClick={getCookie}
          className="m-2 bg-indigo-500 p-2 rounded-md text-white"
        >
          get cookie
        </button>
        <button
          onClick={updateCookie}
          className="m-2 bg-indigo-500 p-2 rounded-md text-white"
        >
          update cookie
        </button>
        <button
          onClick={deleteCookie}
          className="m-2 bg-indigo-500 p-2 rounded-md text-white"
        >
          delete cookie
        </button>
      </div>
    </main>
  );
}

export default Home;
