import timeFormatter from "../helpers/timeFormatter";

interface VenueCardProps {
  venue: Venue;
}

export default function VenueCard({ venue }: VenueCardProps) {
  return (
    <div
      key={venue.name}
      className="flex flex-col overflow-hidden rounded-lg shadow-lg"
    >
      <div className="flex-shrink-0">
        <img
          className="h-48 w-full object-cover"
          src={"/pub-placeholder.jpg"}
          alt=""
        />
      </div>
      <div className="flex flex-1 flex-col justify-between bg-white p-6">
        <div className="flex-1">
          <p className="text-xl font-medium text-primary">
            <a href={`venues/${venue.id}`} className="hover:underline">
              {venue.name}
            </a>
          </p>
          <a href={`venues/${venue.id}`} className="mt-2 block">
            <h3 className="mt-3 text-primary text-lg">Address</h3>
            <p className="text-primary text-sm">{venue.address.address_1}</p>
            <p className="text-primary text-sm">{venue.address?.address_2}</p>
            <p className="text-primary text-sm">{venue.address.town_city}</p>
            <p className="text-primary text-sm">{venue.address.postcode}</p>
            <p className="text-primary text-sm">{venue.address.country}</p>
          </a>
        </div>
        <div className="mt-6 flex items-center">
          <div className="flex-shrink-0">
            <a href={venue.address.address_1}>
              <span className="sr-only">{venue?.address?.address_2}</span>
            </a>
          </div>

          <p className="text-sm font-medium text-gray-900">
            <a href={`venues/${venue.id}`} className="hover:underline"></a>
          </p>
          <div className="flex flex-col text-sm text-primary">
            <time dateTime={venue.opening_time}>
              Opening Time {timeFormatter(venue.opening_time)}
            </time>
            <time dateTime={venue.closing_time}>
              Closing Time {timeFormatter(venue.closing_time)}
            </time>
          </div>
        </div>
      </div>
    </div>
  );
}
