import axios from "axios";
import Cookies from "js-cookie";

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
    const clientConfig = {
      ...config,
      headers: {
        Authentication: `Bearer ${localStorage.getItem("token")}`,
      },
    };

    if (
      (config.method == "post" ||
        config.method == "put" ||
        config.method == "delete") &&
      !Cookies.get("XSRF-TOKEN")
    ) {
      return setCSRFToken().then((response) => {
        console.log(response);

        return clientConfig;
      });
    }

    return clientConfig;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

const setCSRFToken = () => {
  return axios.get(process.env.NEXT_PUBLIC_BASE_URL + "sanctum/csrf-cookie"); // resolves to '/api/csrf-cookie'.
};

export default client;
