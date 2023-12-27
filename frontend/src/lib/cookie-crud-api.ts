import axios, { AxiosError } from "axios";

interface Body {
  accessToken: string;
  refreshToken: string;
  info: Record<string, any>;
}

// set cookies
export const setCookie = async (body: Body) => {
  try {
    const { data } = await axios.post(
      "http://localhost:3000/api/auth/token/set",
      {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        info: body.info,
      }
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};

// get cookies
export const getCookie = async () => {
  try {
    const { data } = await axios.get(
      "http://localhost:3000/api/auth/token/get"
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};

// update cookies
export const updateCookie = async (body: Body) => {
  try {
    const { data } = await axios.put(
      "http://localhost:3000/api/auth/token/update",
      {
        accessToken: body.accessToken,
        refreshToken: body.refreshToken,
        info: body.info,
      }
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};

// delete cookies
export const deleteCookie = async () => {
  try {
    const { data } = await axios.delete(
      "http://localhost:3000/api/auth/token/delete"
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }
  }
};
