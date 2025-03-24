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

    // Supprimer une notification par son ID (DELETE)
    deleteNotificationByCollaborateur: builder.mutation({
      query: (id) => ({
        url: `/notification/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

// Export des hooks générés par RTK Query
export const {
  useGetNotificationByCollaborateurQuery, // Hook pour GET
  useDeleteNotificationByCollaborateurMutation, // Hook pour DELETE
} = NotificationApi;
