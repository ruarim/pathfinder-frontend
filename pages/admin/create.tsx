import { useAuthContext } from "../../hooks/context/useAuthContext";
import { useGetUser } from "../../hooks/queries/getUser";
import CreateVenueForm from "../../forms/createVenue";
import LoadingSpinner from "../../components/LoadingSpinner";

export default function Create() {
  const { isLoggedIn } = useAuthContext();
  const { data: userData, isLoading } = useGetUser();
  const user = userData?.data.user;

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    );

  return isLoggedIn && user?.is_admin === 1 ? (
    <CreateVenueForm />
  ) : (
    <div className="font-bold text-2xl flex items-center justify-center h-screen">
      YOU ARE NOT AN ADMIN
    </div>
  );
}
