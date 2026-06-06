export interface JwtTokenCombination {
  accessToken: string;
  refreshToken: string;
}

export interface UserCredentialsVerification {
  result: 'ok' | 'error';
}

// TODO: create global User class
export interface Temporary_User {
  id: string;
  userName: string;
}
