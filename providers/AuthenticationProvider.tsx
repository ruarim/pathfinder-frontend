import React, { createContext } from "react";

interface AuthenticationContextInterface {
  register: (data: RegisterResponse) => Promise<void>;
}
const AuthenticationContext = createContext<AuthenticationContextInterface>({
  register: async (data) => undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  function login() {}

  async function register(data: RegisterResponse) {
    console.log(data);
    localStorage.setItem("token", data.token ?? "");
  }

  function logout() {}
  return (
    <AuthenticationContext.Provider
      value={{
        register,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
