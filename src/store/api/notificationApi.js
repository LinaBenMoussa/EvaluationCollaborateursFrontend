import { api } from "./api";

export const NotificationApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // Récupérer les notifications par collaborateur (GET)
    getNotificationByCollaborateur: builder.query({
      query: (id) => ({
        url: `/notification/collaborateur/${id}`,
        method: "GET",
      }),
    }),

    deleteNotificationByCollaborateur: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "DELETE",
      }),
    }),

    markNotificationsAsRead: builder.mutation({
      query: (notificationIds) => ({
        url: `/notification/lu`,
        method: "PUT",
        body: notificationIds,
      }),
    }),
  }),
});

export const {
  useGetNotificationByCollaborateurQuery,
  useDeleteNotificationByCollaborateurMutation,
  useMarkNotificationsAsReadMutation,
} = NotificationApi;
