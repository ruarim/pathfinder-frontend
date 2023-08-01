import { useForm } from "react-hook-form";
import { useRegister } from "../hooks/mutations/useRegister";
import { useAuthContext } from "../hooks/context/useAuthContext";

export default function Register() {
  const { mutateAsync: registerUser, data: user } = useRegister();
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
  } = useForm<RegisterUserMutationData>();
  const { registerHandler, setRegisterModalOpen } = useAuthContext();

  const onSubmit = async (data: RegisterUserMutationData) => {
    registerUser(data)
      .then((res) => {
        if (registerHandler && setRegisterModalOpen) {
          registerHandler(res);
          return setRegisterModalOpen(false);
        }
      })
      .catch((e) => {
        setError("password", {
          type: "server",
          message: e.response.data.message,
        });
      });
  };

  const inputStyle =
    "block w-full appearance-none rounded-lg border border-gray-300 p-3 placeholder-gray-400 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm bg-gray-100";

  return (
    <>
      <div className="flex min-h-full flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* logo here */}
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create an account
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
                  Email address
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
                  htmlFor="username"
                  className="block text-sm font-medium text-gray-700"
                >
                  Username
                </label>
                <div className="mt-1">
                  <input
                    {...register("username")}
                    placeholder="Username"
                    id="username"
                    name="username"
                    type="username"
                    autoComplete="username"
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

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-full border border-transparent bg-contrast/75 p-3 text-md font-medium shadow-sm hover:bg-contrast focus:outline-none focus:ring-2 focus:bg-contrast/75 focus:ring-offset-2"
                >
                  Register
                </button>
              </div>
              <div className="text-red-600">
                {errors.password && <p>{errors.password.message}</p>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
