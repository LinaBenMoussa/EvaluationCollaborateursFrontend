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
  }),
});
export const { useAddCongeMutation, useGetCongesQuery } = CongeApi;
