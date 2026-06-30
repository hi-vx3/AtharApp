import { api } from "./apiClient";

export const joinRepository = ()            => api.post("/github/join");
export const getContributors = ()           => api.get("/github/contributors");
export const checkCollaboratorStatus = ()   => api.get("/github/check-collaborator");
