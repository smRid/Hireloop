import { apiClient } from "@/lib/apiClient";

export const registerCompany = (payload) => {
  return apiClient.post("/companies", payload);
};
