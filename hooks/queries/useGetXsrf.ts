import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetXsrfHeaders = () => {
  return useQuery<any, any, any>({
    queryKey: ["xsrf"],
    queryFn: () => client.get("http://localhost:8000/sanctum/csrf-cookie"),
  });
};
