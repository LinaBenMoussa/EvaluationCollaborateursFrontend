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
  }),
});
export const { useAddIssueMutation, useGetIssuesQuery, useGetIssuesByCollaborateurQuery } =
  IssueApi;
