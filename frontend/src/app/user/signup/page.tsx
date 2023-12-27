import SignUpForm from "@/components/ui/SignUpForm";
import { authOptions } from "@/lib";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

async function SignUpPage() {
  const session = await getServerSession(authOptions);
  if (session?.accessToken) {
    return redirect("/");
  }

  return (
    <div>
      <SignUpForm />
    </div>
  );
}

export default SignUpPage;
