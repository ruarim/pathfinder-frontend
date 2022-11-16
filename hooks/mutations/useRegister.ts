import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../axios/apiClient";

// const queryClient = useQueryClient();

export const useRegistser = () => {
  return useMutation<unknown, unknown, RegisterUserMutationData>({
    mutationFn: (data) => {
      return client.post("/register", data);
    },
    // onSuccess: () => {
    //   // Invalidate and refetch
    //   queryClient.invalidateQueries({ queryKey: ["user"] });
    // },
  });
};
