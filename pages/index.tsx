import { useAuthContext } from "../hooks/context/useAuthContext";

export default function Home() {
  const { isLoggedIn } = useAuthContext();
  console.log({ isLoggedIn });

  <h1 className="text-3xl font-bold underline bg-blue-400">Hello world!</h1>;
}
