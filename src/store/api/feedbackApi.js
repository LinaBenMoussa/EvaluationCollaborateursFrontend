import { api } from "./api";

export const feedbackApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addFeedback: builder.mutation({
      query: (credentials) => ({
        url: "/feedback/create",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    getFeedback: builder.query({
      query: (id) => ({
        url: `/feedback/collaborateur/${id}`,
        method: "GET",
      }),
    }),
    getFeedbackByManager: builder.query({
      query: (id) => ({
        url: `/feedback/manager/${id}`,
        method: "GET",
      }),
    }),
    filtreFeedbacks: builder.query({
      query: ({ managerId, startDate, endDate, collaborateurId, offset, limit }) => ({
        url: `/feedback/filtre`,
        method: "GET",
        params: { managerId, startDate, endDate, collaborateurId, offset, limit },
      }),
    }),
  }),
});
export const {
  useAddFeedbackMutation,
  useGetFeedbackQuery,
  useGetFeedbackByManagerQuery,
  useFiltreFeedbacksQuery,
} = feedbackApi;
