export interface JwtPayload {
  iat?: number;
  exp?: number;
  sub?: string;
  aud?: string;
  did: string;
  userName?: string;
  userId?: string;
  jti?: string;
  kid?: boolean;
  iss?: string;
}
