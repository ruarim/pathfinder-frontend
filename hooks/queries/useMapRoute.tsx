import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const mapboxToken = process.env.NEXT_PUBLIC_MAP_BOX_TOKEN;

export const useMapRoute = ({
  venuesPlan,
  startPoint,
  endPoint,
}: {
  venuesPlan: Venue[];
  startPoint: MapLocation;
  endPoint: MapLocation;
}) => {
  const { data: routeData } = useQuery(
    ["points", venuesPlan, startPoint, endPoint],
    () => {
      const step = "20";
      const radiuses = venuesPlan.map(() => step);
      if (startPoint.place_name != "") radiuses.push(step);
      if (endPoint.place_name != "") radiuses.push(step);
      const radiusesString = radiuses.join(";");

      return axios.get(
        `https://api.mapbox.com/matching/v5/mapbox/driving/${routePoints}?geometries=geojson&radiuses=${radiusesString}&access_token=${mapboxToken}`
      );
    }
  );

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

  const routePoints = getPlanPoints(
    venuesPlan,
    { lat: startPoint.center[0], long: startPoint.center[1] },
    { lat: endPoint.center[0], long: endPoint.center[1] }
  );

  return routeData?.data.matchings[0].geometry.coordinates;
};
