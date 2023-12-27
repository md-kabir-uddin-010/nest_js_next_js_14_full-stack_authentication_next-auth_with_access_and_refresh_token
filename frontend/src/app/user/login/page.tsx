import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import LoginForm from "@/components/ui/LoginForm";
import SignUpRoute from "@/components/ui/SignUpRoute";
import { authOptions } from "@/lib";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session?.accessToken) {
    return redirect("/");
  }

  return (
    <div className=" w-96 mt-8 mx-auto shadow-md border border-gray-100 rounded-lg px-4 py-8">
      <h1 className="mb-8 border-b pb-5 text-2xl font-bold text-center">
        Login Form
      </h1>
      <GoogleLoginButton />

      <p className=" capitalize text-center mt-3">or</p>
      <LoginForm />
      <SignUpRoute />
    </div>
  );
}

export default LoginPage;
