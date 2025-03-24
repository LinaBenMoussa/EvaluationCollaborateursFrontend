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
    getPointagesByDate: builder.query({
      query: ({ id, date }) => ({
        url: `/pointages/manager/${id}/${date}`,
        method: "GET",
      }),
    }),
    getPointagesByCollaborateur: builder.query({
      query: (id) => ({
        url: `/pointages/collaborateur/${id}`,
        method: "GET",
      }),
    }),
    filtrePointages: builder.query({
      query: ({ managerId, startDate, endDate, offset, limit }) => ({
        url: `/pointages/filtre`,
        method: "GET",
        params: { managerId, startDate, endDate, offset, limit },
      }),
    }),
  }),
});
export const {
  useAddPointageMutation,
  useGetPointagesQuery,
  useGetPointagesByCollaborateurQuery,
  useGetPointagesByDateQuery,
  useFiltrePointagesQuery,
} = PointageApi;
