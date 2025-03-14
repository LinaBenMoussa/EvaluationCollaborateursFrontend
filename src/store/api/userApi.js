import { api } from "./api";

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (credentials) => ({
        url: "/users/create",
        method: "POST",
        body: { ...credentials },
      }),
    }),
    editUser: builder.mutation({
      query: (credentials) => ({
        url: "/users",
        method: "PUT",
        body: { ...credentials },
      }),
    }),
    getCollaborateursByManager: builder.query({
      query: (id) => ({
        url: `/users/collaborateursByManager/${id}`,
        method: "GET",
      }),
    }),
    getByRole: builder.query({
      query: (role) => ({
        url: `/users/byrole/${role}`,
        method: "GET",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),
    getUserById: builder.query({
      query: (id) => ({
        url: `/users/${id}`,
        method: "GET",
      }),
    }),
    getCollaborateursStats: builder.query({
      query: ({ id, startDate, endDate, type }) => ({
        url: `/users/collaborateur/stats/${id}`,
        method: "GET",
        params: { startDate, endDate, type },
      }),
    }),
  }),
});
export const {
  useAddUserMutation,
  useGetCollaborateursByManagerQuery,
  useGetByRoleQuery,
  useEditUserMutation,
  useGetUserByIdQuery,
  useDeleteUserMutation,
  useGetCollaborateursStatsQuery,
} = userApi;
