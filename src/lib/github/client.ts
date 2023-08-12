import { Octokit } from "octokit";

let instance: Octokit | undefined = undefined;

export const getOctokitClient = (accessToken: string) => {
  if (instance) return instance;

  instance = new Octokit({
    auth: accessToken,
  });
  return instance;
};
