export interface TokenCombination {
  accessToken: string;
  refreshToken: string;
}

export interface UserCredentialsVerification {
  result: 'ok' | 'error';
}
