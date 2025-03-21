import { api } from "./api";

export const PointageApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addPointage: builder.mutation({
      query: (credentials) => ({
        url: "/pointages",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getPointages: builder.query({
      query: (id) => ({
        url: `/pointages/manager/${id}`,
        method: "GET",
      }),
    }),
    getPointagesByCollaborateur: builder.query({
      query: (id) => ({
        url: `/pointages/collaborateur/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useAddPointageMutation, useGetPointagesQuery, useGetPointagesByCollaborateurQuery } =
  PointageApi;
