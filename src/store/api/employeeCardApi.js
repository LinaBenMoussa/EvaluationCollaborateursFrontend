import { api } from "./api";

export const EmployeeCardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEmployeeCards: builder.query({
      query: ({ managerId, selectedDate }) => ({
        url: "/employee-cards", // Endpoint de l'API
        method: "GET",
        params: { managerId, selectedDate }, // Passer les paramètres dans l'URL
      }),
    }),
  }),
});

// Exporter le hook généré par `builder.query`
export const { useGetEmployeeCardsQuery } = EmployeeCardApi;
