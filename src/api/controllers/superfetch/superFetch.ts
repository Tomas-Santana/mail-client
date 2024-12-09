import { ApiRoute, ApiRouteParams } from "../../routes";
import { handleResponse, createRouteWithParams, getHeaders, generateFormData } from "./helpers";
import type { SuperFetchMultiPartParams, SuperFetchParams, FileUpload } from "./types";


export class SuperFetchError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = "SuperFetchError";
  }
}

export async function superFetch<
  Request,
  Response,
  Route extends ApiRoute = ApiRoute,
  QueryParams extends Record<string, any> | undefined = undefined
>({
  options,
  route,
  routeParams,
  queryParams,
  responseSchema,
  payload,
}: SuperFetchParams<Request, Response, Route, QueryParams>): Promise<Response> {
  console.log("superfetch")
  if (routeParams === undefined) {
    routeParams = [] as ApiRouteParams<Route>;
  }

  const headers = await getHeaders(options.includeCredentials ?? false, false, options.method);
  console.log(headers)


  let realRoute = createRouteWithParams<Route, QueryParams>(
    route,
    routeParams,
    queryParams
  );

  console.log("realRoute")
  console.log(realRoute)

  const response = await fetch(realRoute, {
    method: options.method,
    headers: headers,
    body: payload ? JSON.stringify(payload) : undefined,
    credentials: options.includeCredentials ? "include" : "omit",
  });


  return handleResponse(response, responseSchema);
}



export async function superFetchMultipart<
  Request extends Record<string, string | FileUpload[] | FileUpload>,
  Response,
  Route extends ApiRoute = ApiRoute,
  QueryParams extends Record<string, any> | undefined = undefined
>({
  options,
  route,
  routeParams,
  queryParams,
  responseSchema,
  payload,
}: SuperFetchMultiPartParams<
  Request,
  Response,
  Route,
  QueryParams
>): Promise<Response> {
  if (routeParams === undefined) {
    routeParams = [] as ApiRouteParams<Route>;
  }

  const headers = await getHeaders(options.includeCredentials ?? false, true);

  // @ts-ignore
  let realRoute = createRouteWithParams<Route, QueryParams>(
    route,
    routeParams,
    queryParams
  );

  const formData = generateFormData<Request>(payload);

  const response = await fetch(realRoute, {
    method: "POST",
    headers: headers,
    body: formData,
    credentials: options.includeCredentials ? "include" : "omit",
  });

  return handleResponse(response, responseSchema);
}


