import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { createContext, useEffect, useState } from "react";

type RegisterFunction = (data: RegisterResponse) => void;
type LogoutFunction = () => void;
type LoginFunction = (data: LoginResponse) => void;
type setLoginModalOpen = (value: boolean) => void;
type setRegisterModalOpen = (value: boolean) => void;
type handleLoggedIn = () => void;

interface AuthenticationContextInterface {
  registerHandler: RegisterFunction;
  logout: LogoutFunction;
  loginHandler: LoginFunction;
  isLoggedIn: boolean;
  loginModalOpen: boolean;
  registerModalOpen: boolean;
  setRegisterModalOpen: setRegisterModalOpen;
  setLoginModalOpen: setLoginModalOpen;
  handleLoggedIn: handleLoggedIn;
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
  handleLoggedIn: () => undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  async function loginHandler(data: LoginResponse) {
    setLoginModalOpen(false);
    localStorage.setItem("token", data.data.token ?? "");
    localStorage.setItem("user_id", data.data.user.id.toString() ?? "");
    setIsLoggedIn(true);
    queryClient.invalidateQueries();
  }

  function registerHandler(data: RegisterResponse) {
    setRegisterModalOpen(false);
    localStorage.setItem("token", data.data.token ?? "");
    setIsLoggedIn(true);
    queryClient.invalidateQueries();
  }

  function logout() {
    router.push("/");
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    setIsLoggedIn(false);
    queryClient.invalidateQueries();
  }

  function getToken() {
    return localStorage.getItem("token");
  }

  function handleLoggedIn() {
    if (!isLoggedIn) {
      if (setLoginModalOpen) setLoginModalOpen(true);
    }
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
        handleLoggedIn,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
