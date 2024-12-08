const server = import.meta.env.SERVER || "http://127.0.0.1:5000";
export const resourceURL = server + "/resources";
export const uploadthingUrl = server + "/upload";
export const apiRoutes = {
  login: () => `${server}/auth/login`,
  register: () => `${server}/auth/register`,
  send: () => `${server}/mail/send`,
  "fetch/[inbox]": (inbox: string) => `${server}/mail/fetch/${inbox}`,
  "mark/[inbox]/[id]": (inbox: string, id: string) => `${server}/mail/mark/${inbox}/${id}`,
};

export type ApiRoutes = typeof apiRoutes;
export type ApiRoute = keyof ApiRoutes;

export type ApiRouteParams<T extends ApiRoute> = Parameters<ApiRoutes[T]>;
