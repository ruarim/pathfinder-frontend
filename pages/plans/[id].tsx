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
import { Combobox, Tab, Transition } from "@headlessui/react";
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
  const { data: userData } = useGetUser();
  const user = userData?.data.user;
  const startName = plan?.startpoint_name
    ? plan?.startpoint_name.split(",")
    : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];
  const creator = getCreator(plan.users);
  const avg_rating = plan?.rating == undefined ? 0 : plan?.rating;

  const { mutateAsync: togglePublic } = useMutation<
    any,
    any,
    { is_public: 0 | 1 }
  >((data) => client.post(`paths/${plan.id}/set_public`, data));

  const queryClient = useQueryClient();

  const handleTogglePublic = async (is_public: 0 | 1) => {
    try {
      await togglePublic({ is_public });
    } catch (e) {
      console.log(e);
    }
    queryClient.invalidateQueries(["plan"]);
  };
  return (
    <div className="w-full">
      {plan && (
        <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
          {/* Product */}
          <div className="lg:grid lg:grid-cols-7 lg:grid-rows-1 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
            {/* Product image */}
            <div className="lg:col-span-4 lg:row-end-1">
              <div className="aspect-w-4 aspect-h-3 overflow-hidden rounded-lg bg-gray-100 w-full">
                <MapBox
                  startpoint={{
                    lat: plan.startpoint_lat,
                    long: plan.startpoint_long,
                  }}
                  endpoint={{
                    lat: plan?.endpoint_lat,
                    long: plan?.endpoint_long,
                  }}
                  venues={plan.venues}
                />
              </div>
            </div>

            {/* Product details */}
            <div className="mx-auto mt-14 max-w-2xl sm:mt-16 lg:col-span-3 lg:row-span-2 lg:row-end-2 lg:mt-0 lg:max-w-none w-full">
              <div className="flex flex-col-reverse">
                <div className="mt-4">
                  <div className="space-y-1">
                    <div className="md:flex md:justify-between">
                      <div className="space-y-1">
                        <h1 className="text-3xl font-bold">{plan.name}</h1>
                        {user && isInvited(plan.users, user) && (
                          <div className="md:flex md:space-x-2 font-bold text-lg">
                            {plan?.start_date && (
                              <h2>
                                {new Date(plan?.start_date).toDateString()}
                              </h2>
                            )}
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
                          {plan.is_public === 1 ? (
                            <button
                              onClick={() => {
                                if (user && isCreator(user, plan.users))
                                  handleTogglePublic(0);
                              }}
                              className="text-gray-400 flex pt-1 hover:underline"
                            >
                              <div>Public</div>
                              <div className="pl-1 pt-1">
                                <LockOpenIcon className="w-4" />
                              </div>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (user && isCreator(user, plan.users))
                                  handleTogglePublic(1);
                              }}
                              className="text-gray-400 flex pt-1 hover:underline"
                            >
                              <div>Private</div>
                              <div className="pl-1 pt-1">
                                <LockClosedIcon className="w-4" />
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                    <Rating avg_rating={plan.rating} plan={plan} />
                  </div>
                </div>
              </div>

              <p className="mt-6 text-gray-500">
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
                    {user && <InviteCard plan={plan} user={user} />}
                  </Tab.Panel>
                </Tab.Panels>
              </Tab.Group>
              <div className="mt-1  pt-10">
                <ul role="list" className="mt-4 flex items-center space-x-6">
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Facebook</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Instagram</span>
                      <svg
                        className="h-6 w-6"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="flex h-6 w-6 items-center justify-center text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Share on Twitter</span>
                      <svg
                        className="h-5 w-5"
                        aria-hidden="true"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
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
    <div className="space-y-2 pt-3">
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
  startpoint?: { lat?: number; long?: number };
  endpoint?: { lat?: number; long?: number };
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
