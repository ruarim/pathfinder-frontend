import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useLogin = () => {
  return useMutation<LoginResponse, unknown, LoginUserMutationData>({
    mutationFn: (data) => {
      return client.post("login", data);
    },
  });
};
