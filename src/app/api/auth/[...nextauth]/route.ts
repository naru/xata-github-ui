import { UsersRepository } from "@/repositories/users";
import { getXataClient } from "@/xata";
import { XataAdapter } from "@next-auth/xata-adapter";
import NextAuth, { AuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";

const xataClient = getXataClient();

async function refreshAccessToken(token: JWT) {
  const url =
    "https://github.com/login/oauth/access_token?" +
    new URLSearchParams({
      client_id: process.env.GITHUB_ID || "",
      client_secret: process.env.GITHUB_SECRET || "",
      grant_type: "refresh_token",
      refresh_token: token.refreshToken,
    });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  const refreshedTokens = await response.json();

  if (!response.ok || !!refreshedTokens.error) {
    throw Error("Unable to refresh the access token.");
  }

  const updatedTokens = {
    ...token,
    accessToken: refreshedTokens.access_token,
    accessTokenExpiresAt: Date.now() + refreshedTokens.expires_in * 1000,
    refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
  };

  await UsersRepository.updateTokens(token.accessToken, {
    accessToken: updatedTokens.accessToken,
    expiresAt: updatedTokens.accessTokenExpiresAt,
    refreshToken: updatedTokens.refreshToken,
  });

  return updatedTokens;
}

export const authOptions: AuthOptions = {
  adapter: XataAdapter(xataClient),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
  ],
  theme: {
    logo: "/logo.svg",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      if (
        user &&
        account &&
        account.refresh_token &&
        account.access_token &&
        account.expires_at
      ) {
        const initialToken = {
          ...token,
          id: user.id,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          accessTokenExpiresAt: Date.now() + account.expires_at * 1000,
        };

        return initialToken;
      }

      if (
        token.accessTokenExpiresAt &&
        Date.now() < token.accessTokenExpiresAt
      ) {
        return token;
      }

      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken,
        user: {
          ...session.user,
          id: token.id,
        },
      };
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
