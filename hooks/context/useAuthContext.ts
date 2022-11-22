import { useContext } from "react";
import { AuthenticationContext } from "../../providers/AuthenticationProvider";

export function useAuthContext() {
  return useContext(AuthenticationContext);
}
