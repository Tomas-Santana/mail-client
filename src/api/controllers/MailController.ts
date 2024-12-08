import { superFetch } from "./superfetch/superFetch";
import { fetchMailResponseSchema, FetchMailResponse } from "@/types/api/fetchEmail";

export default class MailController {
  static async fetchEmail(inbox: string): Promise<FetchMailResponse> {
    const res = await superFetch<undefined, FetchMailResponse, "fetch/[inbox]">({
      options: {
        method: "GET",
        includeCredentials: true,
      }, 
      route: "fetch/[inbox]",
      routeParams: [inbox],
      responseSchema: fetchMailResponseSchema,

    })

    return res;
  }
}