import React from "react";
import axios from "axios";

const client = axios.create({
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(process.env.NODE_ENV === "development" && {
      "Access-Control-Allow-Origin": "*",
    }),
    // ...(token && { "auth": "TOKEN"})
  },
  baseURL: "http://localhost:8000/api/",
  withCredentials: true,
});

client.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    return {
      ...config,
      headers: {
        Authentication: `Bearer ${"getToken"}`,
      },
    };
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default client;
