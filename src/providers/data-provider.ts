import type { UpdateParams } from "@refinedev/core";
import {
  createDataProvider,
  type CreateDataProviderOptions,
  authHeaderBeforeRequestHook,
} from "@refinedev/rest";
import { refreshTokenAfterResponseHook } from "./hooks/refresh-token.after-response.hook";

const { dataProvider, kyInstance } = createDataProvider(
  import.meta.env.VITE_BASE_API_URL + "/api",
  {
    getList: {
      getEndpoint: ({ resource }) => resource,
      getTotalCount: async (response) => {
        const { count } = await response.json();
        return count;
      },
      mapResponse: async (response) => {
        //API returns {data:[]}
        const { results: data } = await response.json();
        return data;
      },
      //buildHeaders: {},
      buildQueryParams: async ({ pagination, sorters, filters }) => {
        const query: Record<string, any> = {};

        //Pagination
        query.page_size = pagination?.pageSize ?? 10;
        query.page = pagination?.currentPage ?? 1;

        //Sorters and Filters
        if (sorters?.length) {
          query.sort = sorters.map(({ field, order }) => ({ field: order }));
        }

        return query;
      },
    },
    getOne: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
      //buildQueryParams:({})=>{}
      mapResponse: async (response, params) => {
        const data = await response.json();
        // API returns: { "data": { "id": 123, "title": "My Post" } }
        // Refine needs: { "id": 123, "title": "My Post" }
        return data;
      },
    },
    deleteOne: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
      buildHeaders: async ({ resource, id, variables }) => ({
        "Content-Type": "application/json",
      }),
      mapResponse: async (response, params) => {
        // Some APIs return just success confirmation
        if (response.status === 204) {
          // Return minimal record with just the ID for confirmation
          return { id: params.id };
        }

        // Your API wraps the deleted record in a "data" property
        // API returns: { "data": { "id": 123, "title": "Deleted Post" } }
        // Refine needs: { "id": 123, "title": "Deleted Post" }
        return response;
      },
    },
    create: {
      getEndpoint: ({ resource }) => `${resource}/`,
      buildBodyParams: async ({ resource, variables }) => {
        //convert form variables according to the API
        //ValiidateInput and return Error if any
        console.log(resource, variables);
        if (resource === "categories") {
          return {
            ...variables,
          };
        }
        return {
          ...variables,
          categoryId: variables.category.id,
        };
      },
      mapResponse: async (response, params) => {
        const { data } = await response.json();
        return data;
      },
    },
    update: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
      // Add required headers for put/patch requests
      getRequestMethod: (params: UpdateParams<any>) => "put",

      buildBodyParams: ({ resource, id, variables, meta }) => {
        //console.log(resource, variables, id);

        return {
          ...variables,
          categoryId: variables.category.id,
        };
      },
      mapResponse: async (response, params) => {
        console.log(params);
      },
    },
    getMany: {
      getEndpoint: ({ resource, ids }) => `${resource}/`,
      buildQueryParams: async ({ resource, ids, meta }) => {
        const query: Record<string, any> = {};

        query.ids = ids.join(",") ?? null;
        return query;
      },
      mapResponse: async (response) => {
        const { results } = await response.json();
        return results;
      },
    },
  },
  {
    hooks: {
      beforeRequest: [
        authHeaderBeforeRequestHook({ ACCESS_TOKEN_KEY: "access_token" }),
      ],
      afterResponse: [
        refreshTokenAfterResponseHook({
          ACCESS_TOKEN_KEY: "access_token",
          REFRESH_TOKEN_KEY: "refresh_token",
          REFRESH_TOKEN_URL:
            import.meta.env.VITE_AUTH_API_URL + "/tokens/refresh",
        }),
      ],
    },
  },
);

export { dataProvider };
