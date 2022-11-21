import React, { createContext } from "react";

type RegisterFunction = (data: RegisterResponse) => void;

interface AuthenticationContextInterface {
  registerHandler: RegisterFunction;
}

const AuthenticationContext = createContext<
  Partial<AuthenticationContextInterface>
>({
  registerHandler: (data) => undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  async function login() {}

  async function registerHandler(data: RegisterResponse) {
    localStorage.setItem("token", data.data.token ?? "");
  }

  async function logout() {}
  return (
    <AuthenticationContext.Provider
      value={{
        registerHandler,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
