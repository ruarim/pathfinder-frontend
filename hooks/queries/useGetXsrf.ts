import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetXsrfHeaders = () => {
  return useQuery<any, any, any>({
    queryKey: ["xsrf"],
    queryFn: () =>
      client.get(process.env.NEXT_PUBLIC_BASE_URL + "sanctum/csrf-cookie"),
  });
};
