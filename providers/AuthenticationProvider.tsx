import { useRouter } from "next/router";
import React, { createContext } from "react";

type RegisterFunction = (data: RegisterResponse) => void;
type LogoutFunction = () => void;

interface AuthenticationContextInterface {
  registerHandler: RegisterFunction;
  logout: LogoutFunction;
}

const AuthenticationContext = createContext<
  Partial<AuthenticationContextInterface>
>({
  registerHandler: (data) => undefined,
  logout: () => undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  async function login() {}

  function registerHandler(data: RegisterResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    router.push("/");
  }

  function logout() {
    localStorage.removeItem("token");
    router.push("/");
  }
  return (
    <AuthenticationContext.Provider
      value={{
        registerHandler,
        logout,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
