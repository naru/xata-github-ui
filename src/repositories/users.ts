import { getXataClient } from "@/xata";

const xataClient = getXataClient();

export class UsersRepository {
  static updateTokens = async (
    previousAccessToken: string,
    {
      accessToken,
      expiresAt,
      refreshToken,
    }: {
      accessToken: string;
      expiresAt: number;
      refreshToken: string;
    },
  ) => {
    const account = await xataClient.db.nextauth_accounts
      .filter({ access_token: previousAccessToken })
      .getFirstOrThrow();


    return account.update({
      access_token: accessToken,
      expires_at: expiresAt,
      refresh_token: refreshToken,
    });
  };
}
