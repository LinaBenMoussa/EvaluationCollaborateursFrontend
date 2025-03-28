import { api } from "./api";

export const CongeApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addConge: builder.mutation({
      query: (credentials) => ({
        url: "/conges",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getConges: builder.query({
      query: (id) => ({
        url: `/conges/manager/${id}`,
        method: "GET",
      }),
    }),
    getCongesByCollaborateur: builder.query({
      query: (id) => ({
        url: `/conges/collaborateur/${id}`,
        method: "GET",
      }),
    }),
    getCongesByCollaborateurAndDate: builder.query({
      query: ({ id, date }) => ({
        url: `/conges/manager/${id}/${date}`,
        method: "GET",
      }),
    }),
    // Dans votre fichier d'API (ex: congeApi.js)
    filtreConges: builder.query({
      query: ({
        managerId,
        startDateDebut,
        endDateDebut,
        startDateFin,
        endDateFin,
        type,
        collaborateurId,
        offset,
        limit,
      }) => ({
        url: `/conges/filtre`,
        method: "GET",
        params: {
          managerId,
          startDateDebut,
          endDateDebut,
          startDateFin,
          endDateFin,
          type,
          collaborateurId,
          offset,
          limit,
        },
      }),
    }),
  }),
});
export const {
  useAddCongeMutation,
  useGetCongesQuery,
  useGetCongesByCollaborateurQuery,
  useGetCongesByCollaborateurAndDateQuery,
  useFiltreCongesQuery,
} = CongeApi;
