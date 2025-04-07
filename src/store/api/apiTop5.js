import { api } from "./api";

export const Top5Api = api.injectEndpoints({
  endpoints: (builder) => ({
    getTop5: builder.query({
      query: () => ({
        url: "/productivite/top5-collaborateurs", // Endpoint de l'API
        method: "GET",
      }),
    }),
  }),
});

// Exporter le hook généré par `builder.query`
export const { useGetTop5Query } = Top5Api;
