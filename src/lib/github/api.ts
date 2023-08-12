import { getXataClient } from "@/xata";
import { getAuthenticatedSession } from "../auth";
import { getOctokitClient } from "./client";

const xata = getXataClient();

export class GithubAPI {
  static getIssues = async () => {
    const session = await getAuthenticatedSession();

    const account = await xata.db.nextauth_accounts
      .filter({
        "user.id": session.user.id,
      })
      .getFirstOrThrow();

    if (!account.access_token) {
      throw new Error("Github access token missing");
    }

    return getOctokitClient(account.access_token).request(
      "GET /repos/naru/xata-github-ui/issues",
      {
        headers: {
          "X-GitHub-Api-Version": "2022-11-28",
        },
      },
    );
  };
}
