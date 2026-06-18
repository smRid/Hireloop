import { apiClient } from "@/lib/apiClient";

export const setRole = (payload) => {
  return apiClient.patch("/users/set-role", payload);
};
