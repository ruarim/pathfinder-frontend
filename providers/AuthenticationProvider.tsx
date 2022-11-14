import React, { createContext, useState } from "react";

interface AuthenticationContextInterface {}
const AuthenticationContext = createContext<AuthenticationContextInterface>({});

type User = {
  username: string;
};

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  function login() {
    localStorage.setItem("user", user?.username ?? "");
    localStorage.setItem("token", token ?? "");
  }

  function register() {
    localStorage.setItem("user", user?.username ?? "");
    localStorage.setItem("token", token ?? "");
  }

  function logout() {}
  return (
    <AuthenticationContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
