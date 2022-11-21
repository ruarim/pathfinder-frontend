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
  token: string;
  user: User;
};
