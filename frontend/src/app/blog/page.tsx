import axios_interceptor from "@/utils/axios/axiosInterceptor";
import { AxiosError } from "axios";

const getData = async () => {
  try {
    const { data } = await axios_interceptor.get("/api/auth/user/get");

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};
export default async function BlogPage() {
  const data = await getData();

  return (
    <div>
      <h1 className="">BlogPage - {data?.msg} </h1>
    </div>
  );
}
