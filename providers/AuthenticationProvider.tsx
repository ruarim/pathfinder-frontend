import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";

type RegisterFunction = (data: RegisterResponse) => void;
type LogoutFunction = () => void;
type LoginFunction = (data: LoginResponse) => void;

interface AuthenticationContextInterface {
  registerHandler: RegisterFunction;
  logout: LogoutFunction;
  loginHandler: LoginFunction;
  isLoggedIn: boolean;
}

const AuthenticationContext = createContext<
  Partial<AuthenticationContextInterface>
>({
  registerHandler: (data) => undefined,
  loginHandler: (data) => undefined,
  logout: () => undefined,
  isLoggedIn: undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();
  async function loginHandler(data: LoginResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    localStorage.setItem("user_id", data.data.user.id.toString() ?? "");
    setIsLoggedIn(true);
    queryClient.invalidateQueries();
  }

  function registerHandler(data: RegisterResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    setIsLoggedIn(true);
    queryClient.invalidateQueries();
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    queryClient.invalidateQueries();
    router.push("/");
  }

  function getToken() {
    return localStorage.getItem("token");
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        registerHandler,
        logout,
        loginHandler,
        isLoggedIn,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
