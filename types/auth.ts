export type SignInRequest = Readonly<{
  username: string;
  password: string;
}>;

export type AuthenticatedUser = Readonly<{
  userId: string;
  username: string;
  authorities: readonly string[];
}>;

export type TokenRefreshRequest = Readonly<{
  refreshToken: string;
}>;

export type JsonWebToken = Readonly<{
  accessToken?: string | null;
  refreshToken?: string | null;
  expiresIn?: number | null;
}>;
