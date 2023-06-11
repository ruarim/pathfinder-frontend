import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

export const useMapRoute = ({
  venues,
  startPoint,
  endPoint,
}: {
  venues: Venue[] | undefined;
  startPoint: MapLocation;
  endPoint: MapLocation;
}) => {
  const [routePoints, setRoutePoints] = useState("");

  useEffect(() => {
    if (venues) {
      const points = getPlanPoints(
        venues,
        { lat: startPoint.center[0], long: startPoint.center[1] },
        { lat: endPoint.center[0], long: endPoint.center[1] }
      );
      setRoutePoints(points);
    }
  }, [venues]);

  const getPlanPoints = (
    venues: Venue[],
    start?: { lat?: number; long?: number },
    end?: { lat?: number; long?: number }
  ) => {
    const venuePoints = venues.map(
      (venue) => `${venue.address.longitude},${venue.address.latitude}`
    );

    let points = "";
    if (startPoint.place_name != "") points += `${start?.lat},${start?.long};`;
    if (venuePoints.length > 0) points += `${venuePoints.join(";")}`;
    if (endPoint.place_name != "") points += `;${end?.lat},${end?.long}`;

    return points;
  };

  return useQuery(
    ["points", venues, startPoint, endPoint, routePoints],
    () => {
      return axios.get(
        `https://api.mapbox.com/directions/v5/mapbox/walking/${routePoints}?geometries=geojson&access_token=${mapboxToken}`
      );
    },
    { enabled: routePoints !== "" }
  );
};
