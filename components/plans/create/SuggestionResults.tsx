import { useState } from "react";
import { useMap } from "react-map-gl";
import CardSlider from "../../CardSlider";
import VenueMapCard from "./VenueMapCard";

interface SuggestionResultsProps {
  suggestions: Venue[];
}
export default function SuggestionResults({
  suggestions,
}: SuggestionResultsProps) {
  const { map } = useMap();
  const [currentIndex, setCurrentIndex] = useState(0);

  const select = () => {
    if (map)
      map.flyTo({
        center: [
          suggestions[currentIndex].address.longitude,
          Number(suggestions[currentIndex].address.latitude) + 0.004,
        ],
        zoom: 14,
      });
  };

  return (
    <div>
      <h2 className="text-md font-medium text-gray-700 mb-2">Route</h2>
      <CardSlider
        onSelect={select}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      >
        {suggestions.map((venue) => (
          <VenueMapCard venue={venue} />
        ))}
      </CardSlider>
    </div>
  );
}
