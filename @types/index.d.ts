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
  attributes: Attribute[];
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
};

type Attribute = {
  key: string;
  value: string;
};

type Attributes = Attribute[];

type Beverage = {
  name: string;
  type: string;
  style: string;
  brewery: string;
  country: string;
  abv: string;
};

type Bevarages = Beverage[];
