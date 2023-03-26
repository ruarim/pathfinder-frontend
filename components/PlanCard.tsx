import { MapPinIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

interface PlanCardProps {
  plan: Plan;
}

export default function PlanCard({ plan }: PlanCardProps) {
  const startName = plan?.startpoint_name
    ? plan?.startpoint_name.split(",")
    : [];
  const endName = plan?.endpoint_name ? plan?.endpoint_name.split(",") : [];

  return (
    <div className="flex flex-col bg-gradient-to-r from-green-300 to-blue-500 rounded-md p-1.5 shadow-md">
      <Link href={`${plan.id}`} className="flex flex-col space-y-2 rounded-md">
        <div className="flex flex-col space-y-2 bg-white rounded-md p-3">
          {plan.startpoint_name && (
            <div className="flex">
              <MapPinIcon className="w-4" />
              <div>{startName[0]}</div>
            </div>
          )}
          {plan.venues.map((venue) => (
            <div>
              <div className="flex">
                <MapPinIcon className="w-4" />
                <h2>{venue.name}</h2>
              </div>
            </div>
          ))}
          {plan.endpoint_name && (
            <div className="flex">
              <MapPinIcon className="w-4" />
              <div>{endName}</div>
            </div>
          )}
        </div>
        <div className="flex flex-col p-2 bg-white rounded-md">
          <div className="text-xl font-medium text-primary">{plan.name}</div>
          <div className="flex space-x-2">
            <div>{plan.start_date}</div>
            <div>{plan.start_time}</div>
          </div>
          <div className="flex flex-col pt-1">
            {plan.venues.map((venue, i, array) => {
              return (
                <div className="p-0.5">
                  {venue.attributes.map((attribute) => {
                    return (
                      <div
                        key={attribute}
                        className="bg-teal-400 text-white p-2 rounded-md space-x-1 text-xs font-medium inline-flex mr-1"
                      >
                        <div>{attribute}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Link>
    </div>
  );
}
