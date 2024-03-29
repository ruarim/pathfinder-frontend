type User = {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  is_admin: number;
  email: string;
  avatar_url: string;
  is_creator?: number;
  has_completed?: number;
};

type UsersResponse = {
  data: {
    data: User[];
  };
};

type UserResponse = {
  data: {
    user: User;
  };
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
  name: string;
  description: string;
  hours: string;
  venue_type: "Pub" | "Bar" | "Restaurant";
  address: Address;
  attributes: string[];
  beverages: Beverage[];
  rating: number;
  images: string[];
};

type VenuesResponse = {
  data: {
    data: Venue[];
  };
};

type AttributesResponse = {
  data: { data: string[] };
};

type Address = {
  address_1: stirng;
  address_2?: string;
  country: string;
  postcode: string;
  town_city: string;
  latitude: number;
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

type PlanMutationData = {
  name: string;
  startpoint_name: string;
  startpoint_lat: number;
  startpoint_long: number;
  endpoint_name?: string;
  endpoint_lat?: number;
  endpoint_long?: number;
  venues: number[];
  start_time?: string;
  start_date?: string;
};

type PlanUserMutationData = {
  email: string;
  remove: boolean;
};

type Plan = {
  id: number;
  name: string;
  startpoint_name: string;
  startpoint_lat: number;
  startpoint_long: number;
  endpoint_name?: string;
  endpoint_lat?: number;
  endpoint_long?: number;
  venues: Venue[];
  users: User[];
  start_date?: string;
  start_time?: string;
  is_public: number;
  rating: number;
};

type PlanResponse = {
  data: {
    data: Plan;
  };
};

type PlansResponse = {
  data: {
    data: Plan[];
  };
};

type VenueFavouriteMutation = {
  remove: boolean;
};

type RatingMutationData = {
  rating: number;
};

type Rating = {
  id: number;
  user_id: number;
  rating: {
    average_rating: number;
    my_rating: number;
  };
};

type Review = {
  id: number;
  created_at: string;
  content: string;
  user: User;
  rating: Rating;
};

type ReviewsData = {
  data: {
    data: Review[];
  };
};
