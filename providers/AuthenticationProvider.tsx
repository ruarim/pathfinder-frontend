import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";

type RegisterFunction = (data: RegisterResponse) => void;
type LogoutFunction = () => void;
type LoginFunction = (data: LoginResponse) => void;
type setLoginModalOpen = (value: boolean) => void;
type setRegisterModalOpen = (value: boolean) => void;

interface AuthenticationContextInterface {
  registerHandler: RegisterFunction;
  logout: LogoutFunction;
  loginHandler: LoginFunction;
  isLoggedIn: boolean;
  loginModalOpen: boolean;
  registerModalOpen: boolean;
  setRegisterModalOpen: setRegisterModalOpen;
  setLoginModalOpen: setLoginModalOpen;
}

const AuthenticationContext = createContext<
  Partial<AuthenticationContextInterface>
>({
  registerHandler: (data) => undefined,
  loginHandler: (data) => undefined,
  logout: () => undefined,
  isLoggedIn: undefined,
  loginModalOpen: undefined,
  registerModalOpen: undefined,
  setRegisterModalOpen: (value) => undefined,
  setLoginModalOpen: (value) => undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function loginHandler(data: LoginResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    localStorage.setItem("user_id", data.data.user.id.toString() ?? "");
    setIsLoggedIn(true);
    setLoginModalOpen(false);
    queryClient.invalidateQueries();
  }

  function registerHandler(data: RegisterResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    setIsLoggedIn(true);
    setRegisterModalOpen(false);
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
        loginModalOpen,
        registerModalOpen,
        setRegisterModalOpen,
        setLoginModalOpen,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
