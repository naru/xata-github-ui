import { AuthenticatedSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function getAuthenticatedSession(): Promise<AuthenticatedSession> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    throw Error("No authenticated session found.");
  }

  return session as AuthenticatedSession;
}
