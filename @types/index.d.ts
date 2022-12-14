type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: number;
  email: string;
};

type RegisterUserMutationData = {
  username: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
};

type RegisterResponse = {
  data: {
    token: string;
    user: User;
  };
  status: number;
};

type LoginUserMutationData = {
  username: string;
  password: string;
};

type LoginResponse = {
  data: {
    token: string;
    user: User;
  };
  status: number;
};

type Venue = {
  id: number;
  capacity: number;
  closing_time: string;
  name: string;
  opening_time: string;
  venue_type: "Pub" | "Bar" | "Restaurant";
  address: Address;
  attributes: string[];
  beverages: Beverage[];
};

type VenueResponse = {
  data: {
    data: Venue[];
  };
};

type Address = {
  address_1: stirng;
  address_2?: string;
  country: string;
  postcode: string;
  town_city: string;
  latitude: number; //@dev could use latLong type here
  longitude: number;
};

type Beverage = {
  name: string;
  type: string;
  style: string;
  brewery: string;
  country: string;
  abv: string;
};

type LatLong = {
  lat: number;
  long: number;
};

type MapLocation = {
  place_name: string;
  center: number[];
};
