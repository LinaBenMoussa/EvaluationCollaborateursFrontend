import { api } from "./api";

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getNotificationByCollaborateur: builder.query({
      query: (id) => ({
        url: `/notification/collaborateur/${id}`,
        method: "GET",
      }),
    }),
  }),
});
export const { useGetNotificationByCollaborateurQuery } = NotificationApi;
