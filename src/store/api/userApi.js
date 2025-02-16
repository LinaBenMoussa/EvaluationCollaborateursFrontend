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
  }),
});
export const { useAddUserMutation, useGetCollaborateursByManagerQuery, useGetByRoleQuery } =
  userApi;
