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

const avatarPhoto = process.env.NEXT_PUBLIC_DEFAULT_AVATAR || "";

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
  const startName = plan?.endpoint_name ? plan?.startpoint_name.split(",") : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];

  return (
    <div className="space-y-2 bg-slate-200 shadow-md p-5 rounded-md">
      <div className="md:flex justify-between space-y-1">
        <h1 className="text-3xl font-bold">{plan.name}</h1>
        <h2 className="text-2xl flex gap-2">
          {plan.users.map((user) => {
            if (user.is_creator) return user.username;
          })}
          <AvatarIcon imageUrl={avatarSrc} />
        </h2>
      </div>
      <div className="grid md:grid-cols-2 space-y-3">
        <div className="space-y-3">
          <div>
            {plan.endpoint_name && (
              <div className="flex">
                <MapPinIcon className="w-4 text-blue-400" />
                {startName[0]}
              </div>
            )}
            <VenueList venues={plan.venues} />
            {plan.endpoint_name && (
              <div className="flex">
                <MapPinIcon className="w-4 text-blue-400" />
                {endName[0]}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <SetParticipants id={plan.id} />
            <UserList users={plan.users} />
          </div>
        </div>
        <MapBox
          center={{
            lat: plan.venues[0].address.latitude,
            long: plan.venues[0].address.longitude,
          }}
          startpoint={{ lat: plan.startpoint_lat, long: plan.startpoint_long }}
          endpoint={{ lat: plan?.endpoint_lat, long: plan?.endpoint_long }}
          venues={plan.venues}
        />
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
          <Link href={`/venues/${venue.id}`} className="flex hover:underline">
            <MapPinIcon className="w-4" />
            {venue.name.substring(0, 29)}
            {venue.name.length > 30 && "..."}
          </Link>
        );
      })}
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

function SetParticipants({ id }: { id: number }) {
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
    UserResponse,
    any,
    UserResponse
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
                                {user.email}
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
          <MapPinIcon className="w-8 text-green-500" />
        </Marker>
      )}

      {/* end */}
      {endpoint && (
        <Marker
          latitude={endpoint.lat}
          longitude={endpoint.long}
          anchor="bottom"
        >
          <MapPinIcon className="w-8" />
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
