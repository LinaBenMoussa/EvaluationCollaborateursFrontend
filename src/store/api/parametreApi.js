import { api } from "./api";

export const ParametreApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getParametre: builder.query({
      query: () => ({
        url: `/parametres`,
        method: "GET",
      }),
    }),
    setParametre: builder.mutation({
      query: (credentials) => ({
        url: "/parametres",
        method: "PUT",
        body: { ...credentials },
      }),
    }),
  }),
});
export const { useGetParametreQuery, useSetParametreMutation } = ParametreApi;
