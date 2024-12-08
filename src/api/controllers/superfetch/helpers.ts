import { z } from "zod";
import { FileUpload, SuperFetchError } from "./types";
import { ApiRoute, ApiRouteParams, apiRoutes } from "@/api/routes";

export async function handleResponse(
  response: globalThis.Response,
  responseSchema: z.ZodType<any>
) {
  if (response.ok) {
    const data = await response.json();
    try {
      return responseSchema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.log(error.errors);
      }

      throw new SuperFetchError(
        "El servidor envió una respuesta inesperada",
        response.status
      );
    }
  } else {
    const data = await response.json();
    console.log(data);
    throw new SuperFetchError(
      data.error ?? "Ocurrió un error",
      response.status
    );
  }
}

export function createRouteWithParams<
  Route extends ApiRoute = ApiRoute,
  QueryParams extends Record<string, any> | undefined = undefined
>(
  route: Route,
  routeParams: ApiRouteParams<Route>,
  queryParams: QueryParams | undefined
): string {
  // @ts-ignore
  let realRoute = apiRoutes[route](...routeParams);

  if (queryParams) {
    const query = new URLSearchParams();

    for (const key in queryParams) {
      if (queryParams[key] === undefined || !queryParams[key]?.toString) {
        continue;
      }
      query.append(key, queryParams[key].toString());
    }

    realRoute += `?${query.toString()}`;
  }
  return realRoute;
}

export async function getHeaders(includeCredentials: boolean, multipart: boolean = false, method: string = "GET") {
  const headers = new Headers();
  if (multipart) {
    headers.set("Content-Type", "multipart/form-data");
  } else if (method === "POST" || method === "PUT") {
    headers.set("Content-Type", "application/json");
  }

  if (includeCredentials) {
    headers.set("Authorization", `Bearer ${localStorage.getItem("token")}`);
  }

  return headers;
}

export function generateFormData<
  Request extends Record<string, string | FileUpload | FileUpload[]>
>(payload: Request) {
  const formData = new FormData();

  for (const key in payload) {
    if (payload[key] === undefined) {
      continue;
    }
    if (Array.isArray(payload[key])) {
      for (const file of payload[key]) {
        formData.append(key, file);
      }
      continue;
    }
    // @ts-ignore
    formData.append(key, payload[key]);
  }
  return formData;
}


