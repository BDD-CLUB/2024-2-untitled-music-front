export interface User {
  uuid: string;
  name: string;
  role: "ROLE_USER";
  email: string;
  artistImage: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: () => void;
  logout: () => void;
}

export interface UserState {
  user: User | null;
}

export interface UserActions {
  updateUser: (user: User) => void;
  clearUser: () => void;
}

export interface AuthContextType extends AuthState, AuthActions {}
export interface UserContextType extends UserState, UserActions {} 