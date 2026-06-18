import { serverFetch } from "@/lib/core/server";

export const getUsers = () => {
  return serverFetch("/users");
};
