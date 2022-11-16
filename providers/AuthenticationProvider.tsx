import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

interface AuthenticationContextInterface {
  setUser: Dispatch<SetStateAction<User | undefined>>;
  setToken: Dispatch<SetStateAction<string | undefined>>;
  token: string | undefined;
  user: User | undefined;
}
const AuthenticationContext = createContext<
  Partial<AuthenticationContextInterface>
>({
  setUser: () => undefined,
  setToken: () => undefined,
  token: undefined,
  user: undefined,
});

function AuthenticationProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>();
  const [token, setToken] = useState<string>();

  function login() {}

  function register() {
    localStorage.setItem("token", token ?? "");
  }

  function logout() {}
  return (
    <AuthenticationContext.Provider
      value={{
        token,
        user,
        setToken,
        setUser,
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
}

export { AuthenticationContext, AuthenticationProvider };
