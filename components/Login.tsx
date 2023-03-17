import { useForm } from "react-hook-form";
import { useAuthContext } from "../hooks/context/useAuthContext";
import { useLogin } from "../hooks/mutations/useLogin";

export default function Login() {
  const { mutateAsync: loginUser, data: user } = useLogin();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<LoginUserMutationData>();
  const { loginHandler, setRegisterModalOpen, setLoginModalOpen } =
    useAuthContext();

  const onSubmit = async (data: LoginUserMutationData) => {
    loginUser(data)
      .then((res) => {
        if (loginHandler && setLoginModalOpen) {
          loginHandler(res);
          return setLoginModalOpen(false);
        }
      })
      .catch(() => {
        setError("password", {
          type: "server",
          message: "Login failed, check your password.",
        });
      });
  };

  const handleRegister = () => {
    if (setRegisterModalOpen && setLoginModalOpen) {
      setLoginModalOpen(false);
      setRegisterModalOpen(true);
    }
  };

  const inputStyle =
    "block w-full appearance-none rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm bg-gray-100";

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-7 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* logo here */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in
          </h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="py-8 px-4 sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    {...register("email")}
                    placeholder="Email"
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    {...register("password")}
                    placeholder="Password"
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="flex space-x-2 justify-between">
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-full border border-transparent bg-notice/75 hover:bg-notice p-3 text-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Sign in
                </button>
                <button
                  onClick={handleRegister}
                  className="flex w-full justify-center rounded-full border border-transparent bg-contrast/75 hover:bg-notice p-3 text-md font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
              <div className="text-red-600">
                {errors.password && <p>Check your email and password</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
