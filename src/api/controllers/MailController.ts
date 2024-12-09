import { superFetch } from "./superfetch/superFetch";
import { fetchMailResponseSchema, FetchMailResponse } from "@/types/api/fetchEmail";
import { SendEmail, SendEmailResponse, sendEmailResponseSchema, sendEmailSchema } from "@/types/api/sendEmail";

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

  static async sendEmail(payload: SendEmail): Promise<SendEmailResponse> {
    const res = await superFetch<SendEmail, SendEmailResponse, "send">({
      options: {
        method: "POST",
        includeCredentials: true,
      },
      route: "send",
      routeParams: [],
      payload,
      responseSchema: sendEmailResponseSchema,
    });

    return res;
  }
}