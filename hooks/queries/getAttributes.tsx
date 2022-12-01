import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useGetAttributes = () => {
  return useQuery<VenueResponse, any, any>({
    queryKey: ["attributes"],
    queryFn: () => client.get("attributes"),
  });
};
