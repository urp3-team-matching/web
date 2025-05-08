type API_ROUTE =
  | {
      url: string;
      method: string;
    }
  | ((id: string) => {
      url: string;
      method: string;
    });

const API_ROUTES = {
  PROJECT: {
    RETREIVE: {
      url: "/api/projects",
      method: "GET",
    } as API_ROUTE,
    CREATE: {
      url: "/api/projects",
      method: "POST",
    } as API_ROUTE,
    UPDATE: (id: string) =>
      ({
        url: `/api/projects/${id}`,
        method: "PUT",
      } as API_ROUTE),
    DELETE: (id: string) =>
      ({
        url: `/api/projects/${id}`,
        method: "DELETE",
      } as API_ROUTE),
  },
} as const;

export default API_ROUTES;
