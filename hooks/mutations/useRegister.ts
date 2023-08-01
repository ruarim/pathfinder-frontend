import { useMutation } from "@tanstack/react-query";
import client from "../../axios/apiClient";

export const useRegister = () => {
  return useMutation<RegisterResponse, unknown, RegisterUserMutationData>({
    mutationFn: (data) => {
      return client.post("register", data);
    },
  });
};
