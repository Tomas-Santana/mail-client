import { ApiRoute, ApiRouteParams } from "@/api/routes";
import { z } from "zod";

export class SuperFetchError extends Error {
  code: number;

  constructor(message: string, code: number) {
    super(message);
    this.code = code;
    this.name = "SuperFetchError";
  }
}

export interface SuperFetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  includeCredentials?: boolean;
}

export interface FileUpload  {
  uri: string;
  name: string;
  type: string;
};

export interface SuperFetchParams<
  Request,
  Response,
  Route extends ApiRoute = ApiRoute,
  QueryParams extends undefined | Record<string, any> = undefined
> {
  options: SuperFetchOptions;
  route: Route;
  routeParams?: ApiRouteParams<Route>;
  queryParams?: QueryParams;
  responseSchema: z.ZodType<Response>;
  payload?: Request;
}

export interface SuperFetchMultiPartParams<
  Request extends Record<string, string | FileUpload | FileUpload[]>,
  Response,
  Route extends ApiRoute = ApiRoute,
  QueryParams extends undefined | Record<string, any> = undefined
> {
  options: Omit<SuperFetchOptions, "method">;
  route: Route;
  routeParams?: ApiRouteParams<Route>;
  queryParams?: QueryParams;
  responseSchema: z.ZodType<Response>;
  payload: Request;
}

