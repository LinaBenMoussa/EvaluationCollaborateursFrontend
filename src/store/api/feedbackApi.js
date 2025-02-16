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
        url: `/feedback/getbycollaborateur/${id}`,
        method: "GET",
      }),
    }),
    getFeedbackByManager: builder.query({
      query: (id) => ({
        url: `/feedback/getbymanager/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useAddFeedbackMutation, useGetFeedbackQuery, useGetFeedbackByManagerQuery } =
  feedbackApi;
