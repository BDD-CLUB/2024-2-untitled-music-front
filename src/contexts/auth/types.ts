export interface User {
  uuid: string;
  name: string;
  role: "ROLE_USER";
  email: string;
  artistImage: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
  updateUser: (user: User) => void;
} 