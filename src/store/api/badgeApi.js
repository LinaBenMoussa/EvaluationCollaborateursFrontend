import { api } from "./api";

export const BadgeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBadgeByCollaborateur: builder.query({
      query: (collaborateurId) => ({
        url: `/badge/collaborateur/${collaborateurId}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetBadgeByCollaborateurQuery } = BadgeApi;
