type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  isAdmin: number;
  email: string;
};

type RegistrationResponse = {};

type RegisterUserMutationData = {
  email: string;
  password: string;
  username: string;
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
  email: string;
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

type Plan = {
  id?: number;
  name: string;
  startpoint_name: string;
  startpoint_lat: number;
  startpoint_long: number;
  endpoint_name?: string;
  endpoint_lat?: number;
  endpoint_long?: number;
  venues: number[];
};

type PlanResponse = {
  data: {
    data: Plan;
  };
};
