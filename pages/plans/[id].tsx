import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
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
import {
  GeolocateControl,
  Layer,
  Map,
  Marker,
  NavigationControl,
  Source,
} from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AvatarIcon from "../../components/AvatarIcon";
import { Combobox, Switch, Tab, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/utility/useDebounce";
import Link from "next/link";
import { useGetUser } from "../../hooks/queries/getUser";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { CheckIcon } from "@heroicons/react/24/outline";
import LoadingButton from "../../components/LoadingButton";
import clsx from "clsx";
import { AxiosError } from "axios";
import { useMapRoute } from "../../hooks/queries/useMapRoute";

const getCreator = (users: User[]) => {
  return users.find((user) => user.is_creator === 1);
};

const isInvited = (users: User[], loggedInUser: User) => {
  return users.find((user) => user.id === loggedInUser.id) ? true : false;
};

const isCreator = (user: User, users: User[]) => {
  return user.id === getCreator(users)?.id;
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
  const { isLoggedIn } = useAuthContext();
  const { data: userData } = useGetUser();
  const user = userData?.data.user;
  const startName = plan?.startpoint_name
    ? plan?.startpoint_name.split(",")
    : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];
  const creator = getCreator(plan.users);

  const queryClient = useQueryClient();

  return (
    <div className="w-full">
      {plan && (
        <div className="mx-auto  sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* Product image */}
            <div className="lg:col-span-4 lg:row-end-1">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 w-full">
                <MapBox
                  startpoint={{
                    place_name: plan.startpoint_name || "",
                    lat: plan.startpoint_lat || 0,
                    long: plan.startpoint_long || 0,
                  }}
                  endpoint={{
                    place_name: plan.endpoint_name || "",
                    lat: plan?.endpoint_lat || 0,
                    long: plan?.endpoint_long || 0,
                  }}
                  venues={plan.venues}
                />
              </div>
            </div>

            <div className="mx-auto mt-4 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none w-full">
              <div className="flex flex-col-reverse">
                <div className="space-y-1">
                  <div className="md:flex md:justify-between">
                    <div className="space-y-1">
                      <h1 className="text-3xl font-bold">{plan.name}</h1>
                      {user && isInvited(plan.users, user) && (
                        <div className="flex md:space-x-2 font-bold text-lg">
                          {plan?.start_date && (
                            <h2>{new Date(plan?.start_date).toDateString()}</h2>
                          )}
                          <div className="px-1">-</div>
                          <h2>{plan?.start_time?.substring(0, 5)}</h2>
                        </div>
                      )}
                    </div>
                    <div className="md:pl-3 space-y-1">
                      <div>
                        {creator && (
                          <h2 className="text-2xl flex gap-2 md:justify-end">
                            <div className="pt-1">{creator?.username}</div>
                            {<AvatarIcon imageUrl={creator?.avatar_url} />}
                          </h2>
                        )}
                      </div>
                      <div className="flex md:justify-end">
                        {isLoggedIn && user && isCreator(user, plan.users) && (
                          <TogglePublic plan={plan} queryClient={queryClient} />
                        )}
                      </div>
                    </div>
                  </div>
                  <Rating avg_rating={plan.rating} plan={plan} />
                </div>
              </div>

              <p className="mt-3 text-gray-500">
                <h2 className="font-medium text-lg">Venues</h2>
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
                </div>
              </p>
            </div>
            <div className="mx-auto mt-5 w-full max-w-2xl lg:col-span-4 lg:mt-0 lg:max-w-none">
              <Tab.Group as="div">
                <div className="border-b border-gray-200">
                  <Tab.List className="-mb-px flex space-x-8">
                    <Tab
                      className={({ selected }) =>
                        clsx(
                          selected
                            ? "border-indigo-600 text-indigo-600"
                            : "border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300",
                          "whitespace-nowrap border-b-2 py-6 text-sm font-medium"
                        )
                      }
                    >
                      Invite
                    </Tab>
                  </Tab.List>
                </div>
                <Tab.Panels as={Fragment}>
                  <Tab.Panel className="-mb-10">
                    <InviteCard plan={plan} user={user} />
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TogglePublic({
  plan,
  queryClient,
}: {
  plan: Plan;
  queryClient: QueryClient;
}) {
  const isPublic = Boolean(plan.is_public);

  const { mutateAsync: togglePublic } = useMutation<
    any,
    any,
    { is_public: 0 | 1 }
  >((data) => client.post(`paths/${plan.id}/set_public`, data));

  const handleTogglePublic = async (is_public: 0 | 1) => {
    togglePublic({ is_public }).then(() =>
      queryClient.invalidateQueries(["plan"])
    );
  };

  return (
    <div>
      <Switch
        checked={isPublic}
        //@ts-ignore
        onChange={() => handleTogglePublic(isPublic ? 0 : 1)}
        className={`${isPublic ? "bg-teal-800" : "bg-teal-600"}
          relative inline-flex h-[28px] w-[56px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${isPublic ? "translate-x-7" : "translate-x-0"}
            pointer-events-none inline-block h-[24px] w-[24px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        >
          <div className="pt-1.5 pl-1.5 text-gray-400">
            {plan.is_public === 1 ? (
              <LockOpenIcon className="w-3" />
            ) : (
              <LockClosedIcon className="w-3" />
            )}
          </div>
        </span>
      </Switch>
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
    <div className="space-y-2">
      {venues.map((venue) => {
        const avg_rating = venue?.rating;
        return (
          <Link href={`/venues/${venue.id}`} className="space-y-2">
            <div className="flex">
              <MapPinIcon className="w-4 text-red-400" />
              <div className="hover:underline ">
                {venue.name.substring(0, 29)}
                {venue.name.length > 30 && "..."}
              </div>
              <div className="pl-1 flex">
                <StarIcon
                  className="text-yellow-400 h-5 w-5 flex-shrink-0 hover:text-yellow-700"
                  aria-hidden="true"
                />
                <p className="font-medium">({avg_rating})</p>
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

function InviteCard({ plan, user }: { plan: Plan; user?: User }) {
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
      endpoint_lat: data?.endpoint_lat,
      endpoint_long: data?.endpoint_long,
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
    <div className="space-y-2 pt-3">
      {isLoggedIn && user ? (
        isInvited(plan.users, user) ? (
          <div>
            {user?.id == getCreator(plan.users)?.id ? (
              <SetParticipants id={plan.id} plan={plan} loggedInUser={user} />
            ) : (
              <h2 className="text-xl font-bold">Invited Users</h2>
            )}
            <UserList users={plan.users} />
          </div>
        ) : (
          <div className="flex items-center justify-center pb-1">
            <LoadingButton
              onClick={() => handleUsePlan(plan)}
              isLoading={isLoading}
              styles="px-6 py-3 rounded-full bg-blue-200 transition hover:bg-blue-300 text-blue-800 flex items-center"
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
    <div className="pt-2">
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
                className="block w-full min-w-[175px] rounded-full p-3 bg-gray-200 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
  startpoint,
  endpoint,
  venues,
}: {
  startpoint: { place_name: string; lat: number; long: number };
  endpoint: { place_name: string; lat: number; long: number };
  venues: Venue[];
}) {
  const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

  const getMidPoint = (venues: Venue[]) => {
    const total = Object.values(venues).reduce(
      (total, current) => {
        return {
          lat: total.lat + Number(current.address.latitude),
          long: total.long + Number(current.address.longitude),
        };
      },
      { lat: 0, long: 0 }
    );

    return { lat: total.lat / venues.length, long: total.long / venues.length };
  };

  const { data: routeData } = useMapRoute({
    venues,
    startPoint: {
      place_name: startpoint.place_name,
      center: [startpoint.long, startpoint.lat],
    },
    endPoint: {
      place_name: endpoint.place_name,
      center: [endpoint.long, endpoint.lat],
    },
  });

  const routeCoords = routeData?.data?.routes[0]?.geometry.coordinates;

  let venuesRoute;
  if (routeCoords)
    venuesRoute = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [...routeCoords],
      },
    };

  return (
    <div className="rounded-md">
      <Map
        id="map"
        initialViewState={{
          latitude: getMidPoint(venues).lat,
          longitude: getMidPoint(venues).long,
          zoom: 13,
          bearing: 0,
          pitch: 0,
        }}
        style={{
          aspectRatio: 8 / 6,
          width: "100%",
          height: "100%",
          borderRadius: "0.375rem",
        }}
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

        {/* route */}
        {routeCoords && venues.length > 0 && (
          /* @ts-ignore */
          <Source id="polylineLayer" type="geojson" data={venuesRoute}>
            <Layer
              id="lineLayer"
              type="line"
              source="my-data"
              layout={{
                "line-join": "round",
                "line-cap": "round",
              }}
              paint={{
                "line-color": "rgba(3, 170, 238, 0.5)",
                "line-width": 5,
              }}
            />
          </Source>
        )}
      </Map>
    </div>
  );
}

export async function getServerSideProps(context: { query: { id: number } }) {
  return {
    props: {
      id: context.query.id,
    },
  };
}
