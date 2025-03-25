import { api } from "./api";

export const IssueApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addIssue: builder.mutation({
      query: (credentials) => ({
        url: "/issues",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getIssues: builder.query({
      query: (id) => ({
        url: `/issues/manager/${id}`,
        method: "GET",
      }),
    }),
    getIssuesByCollaborateur: builder.query({
      query: (id) => ({
        url: `/issues/collaborateur/${id}`,
        method: "GET",
      }),
    }),
    filtreIssues: builder.query({
      query: ({
        managerId,
        startDateDebut,
        endDateDebut,
        startDateEcheance,
        endDateEcheance,
        startDateFin,
        endDateFin,
        collaborateurId,
        offset,
        limit,
      }) => ({
        url: `/issues/filtre`,
        method: "GET",
        params: {
          managerId,
          startDateDebut,
          endDateDebut,
          startDateEcheance,
          endDateEcheance,
          startDateFin,
          endDateFin,
          collaborateurId,
          offset,
          limit,
        },
      }),
    }),
  }),
});
export const {
  useAddIssueMutation,
  useGetIssuesQuery,
  useGetIssuesByCollaborateurQuery,
  useFiltreIssuesQuery,
} = IssueApi;
