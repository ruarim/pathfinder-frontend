import axios from "axios";

const client = axios.create({
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return {
      ...config,
      headers: {
        Authentication: `Bearer ${localStorage.getItem("token")}`,
      },
    };
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default client;
