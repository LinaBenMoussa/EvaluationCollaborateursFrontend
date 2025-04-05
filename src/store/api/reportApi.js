import { api } from "./api";

export const ReportApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReport: builder.mutation({
      query: ({ employeeName, period, productivityScore, respectEcheanceRate, retardRate }) => ({
        url: "/api/reports",
        method: "POST",
        body: { employeeName, period, productivityScore, respectEcheanceRate, retardRate },
        responseHandler: (response) => response.text(),
      }),
    }),
  }),
});

export const { useGetReportMutation } = ReportApi;
