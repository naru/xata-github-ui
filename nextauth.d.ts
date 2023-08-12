import { DefaultUser } from "next-auth";

interface SessionUser extends DefaultUser {
  id: string;
}

declare module "next-auth" {
  interface Session {
    user?: SessionUser;
  }

  interface AuthenticatedSession extends Session {
    user: SessionUser;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends SessionUser {
    refreshToken: string;
    accessToken: string;
    accessTokenExpiresAt: number;
  }
}
