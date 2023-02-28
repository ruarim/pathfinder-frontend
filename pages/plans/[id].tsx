import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import client from "../../axios/apiClient";
import {
  MapPinIcon,
  PlusCircleIcon,
  UserIcon,
} from "@heroicons/react/20/solid";
import { GeolocateControl, Map, Marker, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import AvatarIcon from "../../components/UserIcon";

const avatarPhoto = process.env.NEXT_PUBLIC_DEFAULT_AVATAR || "";

export default function Plan({ id }: { id: string }) {
  const router = useRouter();

  const { data: planData } = useQuery<PlanResponse, any, any>(
    ["plan_id", id],
    () => client.get(`paths/${router.query.id}`)
  );
  const plan = planData?.data?.data;

  //addParticipant mutaion

  //addChallenge mutation

  //display plan
  return (
    <div className="flex justify-center items-center p-6 ">
      {plan && <PlanCard plan={plan} avatarSrc={avatarPhoto} />}
    </div>
  );
}

interface PlanCardProps {
  plan: Plan;
  avatarSrc: string;
}

function PlanCard({ plan, avatarSrc }: PlanCardProps) {
  const startName = plan.startpoint_name.split(",");
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];
  return (
    <div className="space-y-2">
      <div className="md:flex justify-between">
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
            <div className="flex">
              <MapPinIcon className="w-4 text-blue-400" />
              {startName[0]}
            </div>
            <VenueList venues={plan.venues} />
            {plan.endpoint_name && (
              <div className="flex">
                <MapPinIcon className="w-4 text-blue-400" />
                {endName[0]}
              </div>
            )}
          </div>
          <div className="space-y-2">
            <SetParticipants />
            <UserList users={plan.users} />
          </div>
        </div>
        <MapBox
          center={{ lat: plan.startpoint_lat, long: plan.startpoint_long }}
          startpoint={{ lat: plan.startpoint_lat, long: plan.startpoint_long }}
          //endpoint={{ lat: plan?.endpoint_lat, long: plan?.endpoint_long }}
          venues={plan.venues}
        />
      </div>
    </div>
  );
}

//find the center point of all venues and start/endpoint
//or find a way to make the zoom fit all showing points
function findCenterPoint() {}

function MapBox({
  center,
  startpoint,
  //endpoint,
  venues,
}: {
  center: LatLong;
  startpoint: LatLong;
  //endpoint?: LatLong;
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
      style={{ height: "300px", width: "300px" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={mapboxToken}
    >
      <GeolocateControl position="top-right" />
      <NavigationControl position="top-right" />
      {/* start */}
      {
        <Marker
          latitude={startpoint.lat}
          longitude={startpoint.long}
          anchor="bottom"
        >
          <MapPinIcon className="w-8" />
        </Marker>
      }

      {/* venues  */}

      {/* end */}
    </Map>
  );
}

function VenueList({ venues }: { venues: Venue[] }) {
  return (
    <div>
      {venues.map((venue) => {
        return (
          <div className="flex">
            <MapPinIcon className="w-4" />
            {venue.name.substring(0, 29)}
            {venue.name.length > 30 && "..."}
          </div>
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

function SetParticipants() {
  return (
    <div>
      <h2 className="text-xl">Invite your friends</h2>
      <div className="flex space-x-2">
        <input type="text" className="border-2 border-gray-300 rounded-md" />
        <PlusCircleIcon className="w-5" />
      </div>
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
