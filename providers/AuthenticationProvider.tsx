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
  async function loginHandler(data: LoginResponse) {
    console.log(data);

    localStorage.setItem("token", data.data.token ?? "");
    setIsLoggedIn(true);
    router.push("/");
  }

  function registerHandler(data: RegisterResponse) {
    localStorage.setItem("token", data.data.token ?? "");
    setIsLoggedIn(true);
    router.push("/");
  }

  function logout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
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
