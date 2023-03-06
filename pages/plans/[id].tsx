import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import client from "../../axios/apiClient";
import { EnvelopeIcon, MapPinIcon, UserIcon } from "@heroicons/react/20/solid";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AvatarIcon from "../../components/UserIcon";
import { Combobox, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { useDebounce } from "../../hooks/utility/useDebounce";
import Link from "next/link";
import { useGetUser } from "../../hooks/queries/getUser";
import { useAuthContext } from "../../hooks/context/useAuthContext";
import { CheckIcon } from "@heroicons/react/24/outline";
import LoadingButton from "../../components/LoadingButton";

const avatarPhoto = process.env.NEXT_PUBLIC_DEFAULT_AVATAR || "";

const getCreator = (users: User[]) => {
  return users.find((user) => user.is_creator === 1);
};

const isInvited = (users: User[], loggedInUser: User) => {
  return users.find((user) => user.id === loggedInUser.id) ? true : false;
};

export default function Plan({ id }: { id: string }) {
  const router = useRouter();

  const { data: planData } = useQuery<PlanResponse, any, any>(
    ["plan", id],
    () => client.get(`paths/${router.query.id}`)
  );
  const plan = planData?.data?.data;

  //display plan
  return (
    <div className="flex justify-center items-center p-6">
      {plan && <PlanCard plan={plan} avatarSrc={avatarPhoto} />}
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  avatarSrc: string;
}

function PlanCard({ plan, avatarSrc }: PlanCardProps) {
  const startName = plan?.startpoint_name
    ? plan?.startpoint_name.split(",")
    : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];

  return (
    <div className="space-y-2 bg-slate-200 shadow-md p-5 md:p-7 rounded-md">
      <div className="md:flex justify-between space-y-1">
        <h1 className="text-3xl font-bold">{plan.name}</h1>
        <h2 className="text-2xl flex gap-2 md:pr-2">
          {getCreator(plan.users)?.username}
          <AvatarIcon imageUrl={avatarSrc} />
        </h2>
      </div>
      <div className="border bg-slate-200 border-gray-300 rounded-lg"></div>
      <div className="md:flex justify-between space-y-3 md:px-2">
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
          <div className="border bg-slate-200 border-gray-300 rounded-lg"></div>
          <InviteCard plan={plan} />
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
  );
}

function findCenterPoint() {}

function VenueList({ venues }: { venues: Venue[] }) {
  return (
    <div>
      {venues.map((venue) => {
        return (
          <Link href={`/venues/${venue.id}`} className="space-y-2">
            <div className="flex ">
              <MapPinIcon className="w-4" />
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

function InviteCard({ plan }: { plan: Plan }) {
  const { setLoginModalOpen, setRegisterModalOpen, isLoggedIn } =
    useAuthContext();
  const { data: userData } = useGetUser();
  const user = userData?.data.user;
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
        user && isInvited(plan.users, user) ? (
          <>
            {user?.id == getCreator(plan.users)?.id && (
              <SetParticipants id={plan.id} plan={plan} />
            )}
            <UserList users={plan.users} />
          </>
        ) : (
          <div className="flex items-center justify-center pb-1">
            <LoadingButton
              onClick={() => handleUsePlan(plan)}
              isLoading={isLoading}
            >
              Use this plan
            </LoadingButton>
          </div>
        )
      ) : (
        <div className="font-bold text-xl">
          Login to invite your friends
          <div className="flex space-x-2 py-2">
            <button
              onClick={() => {
                if (setLoginModalOpen) setLoginModalOpen(true);
              }}
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Sign in
            </button>
            <button
              onClick={() => {
                if (setRegisterModalOpen) setRegisterModalOpen(true);
              }}
              className="flex w-full justify-center rounded-md border border-transparent bg-emerald-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
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

function SetParticipants({ id, plan }: { id: number; plan: Plan }) {
  const [query, setQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const queryClient = useQueryClient();
  const { data: loggedInUser } = useGetUser();

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
  const loggedIn = loggedInUser?.data?.user;

  return (
    <div className="md:pr-2">
      <h2 className="text-xl font-bold pb-1">Invite your friends</h2>
      <div className="space-y-6">
        <div className="flex space-x-2">
          <Combobox value={selectedUser} onChange={setSelectedUser}>
            <div className="mt-1">
              <Combobox.Input
                id="input"
                className="block w-full rounded-full p-3 border-gray-300 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                    users?.map((user) => {
                      if (loggedIn && user.email == loggedIn.email)
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
                                    <CheckIcon className="w-4" />
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
  );
}

export async function getServerSideProps(context: { query: { id: number } }) {
  return {
    props: {
      id: context.query.id,
    },
  };
}
