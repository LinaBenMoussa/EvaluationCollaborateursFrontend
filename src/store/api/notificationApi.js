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

    getNotificationByManager: builder.query({
      query: (id) => ({
        url: `/notification/manager/${id}`,
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
    filtreNotifications: builder.query({
      query: ({ managerId, startDate, endDate, collaborateurId, offset, limit }) => ({
        url: `/notification/filtre`,
        method: "GET",
        params: {
          managerId,
          startDate,
          endDate,
          collaborateurId,
          offset,
          limit,
        },
      }),
    }),
  }),
});

export const {
  useGetNotificationByCollaborateurQuery,
  useDeleteNotificationByCollaborateurMutation,
  useMarkNotificationsAsReadMutation,
  useGetNotificationByManagerQuery,
  useFiltreNotificationsQuery,
} = NotificationApi;
