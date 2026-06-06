export interface JwtTokenCombination {
  accessToken: string;
  refreshToken: string;
}

export interface UserCredentialsVerification {
  result: 'ok' | 'error';
}
