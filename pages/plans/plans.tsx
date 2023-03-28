import { useQuery } from "@tanstack/react-query";
import client from "../../axios/apiClient";
import LoadingSpinner from "../../components/LoadingSpinner";
import PlanCard from "../../components/PlanCard";
import { useAuthContext } from "../../hooks/context/useAuthContext";

export default function Collection() {
  const { isLoggedIn } = useAuthContext();
  const { data: plansData, isLoading: plansLoading } = useQuery<
    PlanResponse,
    any,
    any
  >(["plans"], () => client.get("paths/user/all"), { enabled: isLoggedIn });

  return (
    <div className="relative px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Plans
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            Search through the plans you've created.
          </p>
        </div>
        {!plansLoading ? (
          <div className="mx-auto pt-6 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {plansData.data.data.map((plan: Plan, key: number) => {
              return <PlanCard plan={plan} key={key} />;
            })}
          </div>
        ) : (
          <div className="text-black flex justify-center p-24">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
}
