import { PlusIcon, XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { useState } from "react";
import { useMap } from "react-map-gl";
import Button from "../../Button";

interface AttributesPickerProps {
  attributes: string[] | undefined;
  venueStopsAttributes: string[][];
  setVenueStopsAttributes: (stops: string[][]) => void;
  venueStopsIndex: number;
  setVenueStopsIndex: (index: number) => void;
  setSelectedPlanningIndex: (index: number) => void;
  suggestions: Venue[] | undefined;
}

export default function AttributesPicker({
  attributes,
  venueStopsAttributes,
  setVenueStopsAttributes,
  venueStopsIndex,
  setVenueStopsIndex,
  setSelectedPlanningIndex,
  suggestions,
}: AttributesPickerProps) {
  const { map } = useMap();

  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const addStop = (stopIndex: number) => {
    if (venueStopsAttributes[stopIndex - 1].length > 0) {
      let stops = venueStopsAttributes;
      stops[venueStopsIndex] = [];
      setVenueStopsAttributes([...stops]);
      setVenueStopsIndex(stopIndex + 1);
    }
  };

  const removeStop = (stopIndex: number) => {
    let stops = venueStopsAttributes;
    if (venueStopsIndex === 1) return;

    stops?.splice(stopIndex, 1);
    setVenueStopsAttributes([...stops]);
    setVenueStopsIndex(venueStopsIndex - 1);
  };

  const removeAttribute = (stopIndex: number, attribute: string) => {
    if (venueStopsAttributes === undefined) return;
    let stops = venueStopsAttributes;
    const attributes = stops[stopIndex];

    const attributeIndex = attributes.indexOf(attribute);
    attributes.splice(attributeIndex, 1);
    stops[stopIndex] = attributes;
    setVenueStopsAttributes([...stops]);

    if (
      attributes.length === 0 &&
      venueStopsAttributes.length - 1 !== stopIndex
    )
      return removeStop(stopIndex);
  };

  const addAttribute = (currentIndex: number, attribute: string) => {
    let stopAttributes;

    let stops = venueStopsAttributes;
    stopAttributes = venueStopsAttributes[currentIndex];

    if (!stopAttributes.includes(attribute)) stopAttributes.push(attribute);

    stops[currentIndex] = stopAttributes;
    setVenueStopsAttributes([...stops]);
  };

  const attributesSelected = () =>
    venueStopsAttributes[0].length > 0 ? true : false;

  const handleSuggestVenues = () => {
    setSelectedPlanningIndex(2);
    if (suggestions && suggestions?.length > 0) {
      const firstSuggestion = suggestions[0];
      if (map)
        map.flyTo({
          center: [
            firstSuggestion.address.longitude,
            firstSuggestion.address.latitude,
          ],
          zoom: 14,
        });
    }
  };

  return (
    <>
      {attributes && (
        <div>
          <div>
            <h2 className="text-md font-medium text-gray-700 mb-1">
              Venue attributes
            </h2>
            <div className="grid grid-cols-4 w-full gap-2">
              {attributes.map((attribute: string, i: number) => {
                if (i > 7 && !showAllAttributes)
                  return <div key={attribute}></div>;
                if (i === 7 && !showAllAttributes)
                  return (
                    <button
                      onClick={() => setShowAllAttributes(true)}
                      className={clsx(
                        "py-1 px-2 w-full mb-1 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-sm font-bold"
                      )}
                      key={attribute}
                    >
                      more..
                    </button>
                  );
                return (
                  <button
                    onClick={(e) =>
                      addAttribute(venueStopsIndex - 1, attribute)
                    }
                    className={clsx(
                      "py-1 px-2 w-full mb-1 rounded-lg transition hover:bg-gray-300 bg-gray-200  text-xs font-medium text-gray-700"
                    )}
                    key={attribute}
                  >
                    {attribute}
                  </button>
                );
              })}
              {showAllAttributes && (
                <button
                  onClick={(e) => setShowAllAttributes(false)}
                  className={clsx(
                    "py-1 px-2 w-full mb-1 rounded-lg transition hover:bg-gray-300 bg-gray-200 text-sm font-bold"
                  )}
                >
                  less..
                </button>
              )}
            </div>
          </div>

          {/* venues stops */}
          <div>
            <h2 className="text-md font-medium text-gray-700 pt-1 mb-1">
              Stops
            </h2>
            {/* attributes */}
            {Array.from(Array(venueStopsIndex).keys()).map((i) => (
              <div key={i} className="my-1 p-1 rounded-md bg-gray-200/80">
                <div className="flex justify-between w-full">
                  <h3 className="font-medium text-sm rounded-full mx-1 text-gray-700">
                    Venue {i + 1}
                  </h3>
                  <button onClick={() => removeStop(i)}>
                    <XMarkIcon className="w-5" />
                  </button>
                </div>
                <div>
                  {venueStopsAttributes[i].length > 0 ? (
                    venueStopsAttributes[i]?.map((attribute) => {
                      return (
                        <div
                          key={attribute}
                          className="bg-teal-400 text-white p-1.5 rounded-md space-x-1 text-xs font-medium inline-flex mr-1 my-0.5"
                        >
                          <div className="flex items-center h-full">
                            <div className="">{attribute}</div>
                            <button
                              onClick={() => removeAttribute(i, attribute)}
                            >
                              <XMarkIcon className="w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="w-full flex justify-center py-1">
                      <span className="font-medium text-sm text-gray-500">
                        Choose some attributes
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div className="w-full grid grid-cols-1 place-items-center">
              <Button onClick={() => addStop(venueStopsIndex)} colour="gray">
                <PlusIcon className="w-5" />
              </Button>
              {attributesSelected() && (
                <div className="grid grid-cols-1 place-items-center pt-1">
                  <Button onClick={() => handleSuggestVenues()} colour="blue">
                    <>
                      View suggestions{" "}
                      {suggestions ? (
                        <>({suggestions.length})</>
                      ) : (
                        attributesSelected() && <>(0)</>
                      )}
                    </>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
