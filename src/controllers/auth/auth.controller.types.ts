export interface CreateUserResponse {
  accessToken: string;
}

export interface LogInUserResponse {
  userName: string;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
