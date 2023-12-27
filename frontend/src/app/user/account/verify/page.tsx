import AccountVerifyButton from "@/components/ui/AccountVerifyButton";

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function AccountVarification({ params, searchParams }: Props) {
  const token = searchParams?.token;
  return (
    <div className=" w-full h-screen flex items-center justify-center">
      {!token && <p>Something went wrong! Plase try again?</p>}

      {token && (
        <div className=" w-80 min-h-[300px] border border-gray-200 rounded-lg flex items-center justify-center shadow-sm">
          <div className=" text-center">
            <h1 className=" mb-6 text-2xl">Click to verify your account</h1>
            <AccountVerifyButton verificationToken={token} />
          </div>
        </div>
      )}
    </div>
  );
}
