import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import client from "../../axios/apiClient";
import {
  EnvelopeIcon,
  LockClosedIcon,
  LockOpenIcon,
  MapPinIcon,
  StarIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AvatarIcon from "../../components/AvatarIcon";
import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/utility/useDebounce";
import Link from "next/link";
import { useGetUser } from "../../hooks/queries/getUser";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { CheckIcon } from "@heroicons/react/24/outline";
import LoadingButton from "../../components/LoadingButton";
import clsx from "clsx";
import { AxiosError } from "axios";

const getCreator = (users: User[]) => {
  return users.find((user) => user.is_creator === 1);
};

const isInvited = (users: User[], loggedInUser: User) => {
  return users.find((user) => user.id === loggedInUser.id) ? true : false;
};

export default function Plan({ id }: { id: string }) {
  const router = useRouter();

  const { data: planData, isError } = useQuery<PlanResponse, AxiosError, any>(
    ["plan", id],
    () => client.get(`paths/${router.query.id}`),
    {
      retry: false,
    }
  );

  const plan = planData?.data?.data;

  if (isError)
    return (
      <div className="grid place-items-center h-screen font-bold">
        <div className="space-y-2">
          <div>YOU CANNOT ACCESS THIS PLAN!</div>
          <div>IF YOU ARE INVITED - TRY SIGNING IN</div>
        </div>
      </div>
    );

  //display plan
  return (
    <div className="flex justify-center items-center p-6">
      {plan && <PlanCard plan={plan} />}
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
}

function PlanCard({ plan }: PlanCardProps) {
  const { data: userData } = useGetUser();
  const user = userData?.data.user;
  const startName = plan?.startpoint_name
    ? plan?.startpoint_name.split(",")
    : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];
  const creator = getCreator(plan.users);
  const avg_rating = plan?.rating == undefined ? 0 : plan?.rating;

  return (
    <div className="bg-gradient-to-r from-green-300 to-blue-500 shadow-md rounded-lg">
      <div className="space-y-2 bg-white md:p-12 rounded-lg m-2 p-5">
        <div className="space-y-1">
          <div className="md:flex md:justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">{plan.name}</h1>
              {user && isInvited(plan.users, user) && (
                <div className="md:flex md:space-x-2 font-bold text-lg">
                  {plan?.start_date && (
                    <h2>{new Date(plan?.start_date).toDateString()}</h2>
                  )}
                  <h2>{plan?.start_time?.substring(0, 5)}</h2>
                </div>
              )}
            </div>
            <div className="md:pl-3 space-y-1">
              <div className="flex md:justify-end">
                {plan.is_public === 1 ? (
                  <div className="text-gray-400 flex pt-1">
                    <div>Public</div>
                    <div className="pl-1 pt-1">
                      <LockOpenIcon className="w-4" />
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-400 flex pt-1">
                    <div>Private</div>
                    <div className="pl-1 pt-1">
                      <LockClosedIcon className="w-4" />
                    </div>
                  </div>
                )}
              </div>
              <div>
                {creator && (
                  <h2 className="text-2xl flex gap-2 md:justify-end">
                    <div className="pt-1">{creator?.username}</div>
                    {<AvatarIcon imageUrl={creator?.avatar_url} />}
                  </h2>
                )}
              </div>
            </div>
          </div>
        </div>

        <Rating avg_rating={avg_rating} plan={plan} />
        <Separator />
        <div className="md:flex justify-between space-y-3 ">
          <div className="space-y-3 md:pr-2">
            <div>
              {plan.startpoint_name && (
                <div className="flex">
                  <MapPinIcon className="w-4 text-green-600" />
                  {startName[0]}
                </div>
              )}
              <VenueList venues={plan.venues} />
              {plan.endpoint_name && (
                <div className="flex">
                  <MapPinIcon className="w-4 text-blue-500" />
                  {endName[0]}
                </div>
              )}
            </div>
            <Separator />
            {user && <InviteCard plan={plan} user={user} />}
          </div>
          <div className="flex justify-center">
            <MapBox
              center={{
                lat: plan.venues[0].address.latitude,
                long: plan.venues[0].address.longitude,
              }}
              startpoint={{
                lat: plan.startpoint_lat,
                long: plan.startpoint_long,
              }}
              endpoint={{ lat: plan?.endpoint_lat, long: plan?.endpoint_long }}
              venues={plan.venues}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function Rating({ avg_rating, plan }: { avg_rating: number; plan: Plan }) {
  const { handleLoggedIn, isLoggedIn } = useAuthContext();
  const queryClient = useQueryClient();
  const { mutateAsync } = useMutation<any, any, RatingMutationData>((data) =>
    client.post(`paths/${plan.id}/rate`, data)
  );

  const setRatingHandler = async (rating: number) => {
    const ratingData: RatingMutationData = {
      rating: rating + 1,
    };

    if (handleLoggedIn && !isLoggedIn) return handleLoggedIn();
    try {
      await mutateAsync(ratingData);
    } catch (e) {
      console.log(e);
    }

    queryClient.invalidateQueries(["plan"]);
  };

  return (
    <button className="flex items-center">
      {[0, 1, 2, 3, 4].map((rating) => (
        <StarIcon
          onClick={() => setRatingHandler(rating)}
          key={rating}
          className={clsx(
            avg_rating && Math.round(avg_rating) > rating
              ? "text-yellow-400"
              : "text-gray-300",
            "h-5 w-5 flex-shrink-0 hover:text-yellow-700"
          )}
          aria-hidden="true"
        />
      ))}
      <span className="pl-1">({avg_rating})</span>
    </button>
  );
}

function VenueList({ venues }: { venues: Venue[] }) {
  return (
    <div>
      {venues.map((venue) => {
        return (
          <Link href={`/venues/${venue.id}`} className="space-y-2">
            <div className="flex ">
              <MapPinIcon className="w-4 text-red-400" />
              <div className="hover:underline ">
                {venue.name.substring(0, 29)}
                {venue.name.length > 30 && "..."}
              </div>
            </div>
            <div className="flex px-2 space-x-1 pb-2">
              {venue?.attributes?.map((attribute, i) => {
                //dont show more then 4
                if (i > 4) return <></>;
                if (i === 4)
                  return (
                    <div
                      key={attribute}
                      className="bg-teal-400 text-white p-2 pr-2 rounded-md space-x-1 text-xs inline-flex items-center font-medium hover:underline"
                    >
                      ...
                    </div>
                  );
                return (
                  <div
                    key={attribute}
                    className="bg-teal-400 text-white p-2 pr-2 rounded-md space-x-1 text-xs inline-flex items-center font-medium"
                  >
                    <div>{attribute}</div>
                  </div>
                );
              })}
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function InviteCard({ plan, user }: { plan: Plan; user: User }) {
  const { setLoginModalOpen, setRegisterModalOpen, isLoggedIn } =
    useAuthContext();
  const [isLoading, setLoading] = useState(false);
  const router = useRouter();

  const { mutateAsync } = useMutation<PlanResponse, any, PlanMutationData>(
    (data) => {
      return client.post(`paths`, data);
    }
  );

  const handleUsePlan = async (data: Plan) => {
    setLoading(true);
    const venues = data.venues.map((venue) => venue.id);
    await mutateAsync({
      name: data.name,
      startpoint_name: data.startpoint_name,
      startpoint_lat: data.startpoint_lat,
      startpoint_long: data.startpoint_long,
      endpoint_name: data?.endpoint_name,
      endpoint_lat: data?.startpoint_lat,
      endpoint_long: data?.startpoint_long,
      start_date: data?.start_date,
      start_time: data?.start_time,
      venues,
    })
      .then((res) => {
        setLoading(false);
        router.push(`${res.data.data.id}`);
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  };

  return (
    <div className="space-y-2">
      {isLoggedIn ? (
        isInvited(plan.users, user) ? (
          <>
            {user?.id == getCreator(plan.users)?.id ? (
              <SetParticipants id={plan.id} plan={plan} loggedInUser={user} />
            ) : (
              <h2 className="text-xl font-bold">Invited Users</h2>
            )}
            <UserList users={plan.users} />
          </>
        ) : (
          <div className="flex items-center justify-center pb-1">
            <LoadingButton
              onClick={() => handleUsePlan(plan)}
              isLoading={isLoading}
              styles="bg-indigo-500 hover:bg-indigo-700 max-w-min flex items-center  justify-center px-5 py-2 rounded-md shadow-md text-white w-full"
            >
              Use this plan
            </LoadingButton>
          </div>
        )
      ) : (
        <div>
          <label className="font-bold text-xl">
            Login to invite your friends
          </label>
          <div className="mx-4 space-x-4 flex justify-center pt-2">
            <button
              className="hover:underline"
              onClick={() => {
                if (setLoginModalOpen) setLoginModalOpen(true);
              }}
            >
              Sign In
            </button>
            <button
              className="bg-contrast/75 hover:bg-contrast p-3 px-7 rounded-full"
              onClick={() => {
                if (setRegisterModalOpen) setRegisterModalOpen(true);
              }}
            >
              Register
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function UserList({ users }: { users: User[] }) {
  return (
    <div>
      {users.map((user) => {
        if (user.is_creator) return <></>;
        else
          return (
            <div className="flex">
              <UserIcon className="w-4" />
              {user.username}
            </div>
          );
      })}
    </div>
  );
}

function SetParticipants({
  id,
  plan,
  loggedInUser,
}: {
  id: number;
  plan: Plan;
  loggedInUser: User;
}) {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const queryClient = useQueryClient();

  //addUser mutaion
  const { mutateAsync: addUser } = useMutation<
    PlanResponse,
    unknown,
    PlanUserMutationData
  >({
    mutationFn: (data) => {
      return client.post(`paths/${id}/participants`, data);
    },
  });

  const addUserHandler = async (user: { email: string; remove: boolean }) => {
    await addUser(user);
    queryClient.invalidateQueries({ queryKey: ["plan"] });
    setSelectedUser("");
  };

  const { data: usersResults, refetch } = useQuery<
    UsersResponse,
    any,
    UsersResponse
  >(
    ["email_search", query],
    () => client.get(`user_email_search?email=${debouncedQuery}`),
    {
      enabled: false,
    }
  );
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.length > 0) {
      refetch();
    }
  }, [debouncedQuery]);

  const users = usersResults?.data?.data;

  return (
    <div className="md:pr-2">
      <h2 className="text-xl font-bold pb-1">Invite your friends</h2>
      <div className="space-y-6">
        <div className="flex space-x-2">
          <Combobox value={selectedUser} onChange={setSelectedUser}>
            <div className="mt-1">
              <Combobox.Input
                id="input"
                className="block w-full rounded-full p-3 bg-gray-200 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder={"Enter users email"}
                onChange={(event) => setQuery(event.target.value)}
              />
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options className="z-10 absolute mt-1 max-h-60 rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {users?.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    users?.slice(0, 5)?.map((user) => {
                      if (loggedInUser && user.email == loggedInUser.email)
                        return <></>;
                      return (
                        <Combobox.Option
                          key={user.email}
                          className={({ active }) =>
                            `cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-teal-600 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={user.email}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={`
                           block truncate ${
                             selected ? "font-medium" : "font-normal"
                           }`}
                              >
                                <div className="flex">
                                  {user.email}
                                  {isInvited(plan.users, user) && (
                                    <CheckIcon className="w-4 text-green-500" />
                                  )}
                                </div>
                              </span>
                              {selected ? (
                                <span
                                  className={`inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-teal-600"
                                  }`}
                                ></span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      );
                    })
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
          <button
            onClick={() =>
              addUserHandler({ email: selectedUser, remove: false })
            }
            disabled={selectedUser === "" ? true : false}
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent disabled:opacity-50 disabled:cursor-not-allowed bg-indigo-600 px-3 py-2 text-sm font-medium leading-4 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Invite
            <EnvelopeIcon className="ml-2 -mr-0.5 h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MapBox({
  center,
  startpoint,
  endpoint,
  venues,
}: {
  center: LatLong;
  startpoint?: { lat?: number; long?: number };
  endpoint?: { lat?: number; long?: number };
  venues: Venue[];
}) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

  return (
    <div className="rounded-md">
      <Map
        id="map"
        initialViewState={{
          latitude: center.lat,
          longitude: center.long,
          zoom: 12,
          bearing: 0,
          pitch: 0,
        }}
        style={{ height: "300px", width: "300px", borderRadius: "0.375rem" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={mapboxToken}
      >
        <GeolocateControl position="top-right" />
        <NavigationControl position="top-right" />

        {/* venues  */}
        {venues.map((venue) => {
          return (
            <Marker
              latitude={venue.address.latitude}
              longitude={venue.address.longitude}
              anchor="bottom"
            >
              <MapPinIcon className="w-8 text-red-400" />
            </Marker>
          );
        })}

        {/* start */}
        {startpoint && (
          <Marker
            latitude={startpoint.lat}
            longitude={startpoint.long}
            anchor="bottom"
          >
            <MapPinIcon className="w-8 text-green-600" />
          </Marker>
        )}

        {/* end */}
        {endpoint && (
          <Marker
            latitude={endpoint.lat}
            longitude={endpoint.long}
            anchor="bottom"
          >
            <MapPinIcon className="w-8 text-blue-400" />
          </Marker>
        )}
      </Map>
    </div>
  );
}

function Separator() {
  return <div className="border bg-slate-200 border-gray-300 rounded-lg"></div>;
}

export async function getServerSideProps(context: { query: { id: number } }) {
  return {
    props: {
      id: context.query.id,
    },
  };
}
