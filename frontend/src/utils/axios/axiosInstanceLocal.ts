import axios from "axios";

const axiosInstanceLocal = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstanceLocal;
