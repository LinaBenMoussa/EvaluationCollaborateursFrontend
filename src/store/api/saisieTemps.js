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
  }),
});
export const { useGetSaisieTempsQuery, useGetSaisieTempsByManagerQuery } = SasieTempsApi;
