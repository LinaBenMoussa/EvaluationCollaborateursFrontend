import { api } from "./api";

export const SasieTempsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSaisieTemps: builder.query({
      query: (id) => ({
        url: `/saisietemps/issue/${id}`,
        method: "GET",
      }),
    }),
    getSaisieTempsByManager: builder.query({
      query: (id) => ({
        url: `/saisietemps/manager/${id}`,
        method: "GET",
      }),
    }),
    filtreSaisiesTemps: builder.query({
      query: ({ managerId, startDate, collaborateurId, endDate, offset, limit }) => ({
        url: `/saisietemps/filtre`,
        method: "GET",
        params: { managerId, startDate, collaborateurId, endDate, offset, limit },
      }),
    }),
  }),
});
export const {
  useGetSaisieTempsQuery,
  useGetSaisieTempsByManagerQuery,
  useFiltreSaisiesTempsQuery,
} = SasieTempsApi;
