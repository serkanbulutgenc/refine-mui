import {
  createDataProvider,
  type CreateDataProviderOptions,
  authHeaderBeforeRequestHook,
  refreshTokenAfterResponseHook,
} from '@refinedev/rest';

const { dataProvider, kyInstance } = createDataProvider(
  'https://jsonplaceholder.typicode.com',
  {
    getList: {
      getEndpoint: ({ resource }) => resource,
      getTotalCount: async (response) => {
        const { total } = await response.json();
        return total;
      },
      mapResponse: async (response) => {
        //API returns {data:[]}
        const { data } = await response.json();
        return data;
      },
      //buildHeaders: {},
      buildQueryParams: async ({ pagination, sorters, filters }) => {
        const query: Record<string, any> = {};

        //Pagination
        query.pageSize = pagination?.pageSize ?? 10;
        query.page = pagination?.page ?? 1;

        //Sorters and Filters

        return query;
      },
    },
    getOne: {
      getEndpoint: ({ resource, id }) => `/${resource}/${id}`,
      //buildQueryParams:({})=>{}
      mapResponse: async (response, params) => {
        const data = await response.json();
        // API returns: { "data": { "id": 123, "title": "My Post" } }
        // Refine needs: { "id": 123, "title": "My Post" }
        return data;
      },
    },
    deleteOne: {
      getEndpoint: ({ resource, id }) => `/${resource}/${id}`,
      buildHeaders: async ({ resource, id, variables }) => ({
        'Content-Type': 'application/json',
      }),
      mapResponse: async (response, params) => {
        const json = await response.json();

        // Some APIs return just success confirmation
        if (json.success && !json.data) {
          // Return minimal record with just the ID for confirmation
          return { id: params.id };
        }

        // Your API wraps the deleted record in a "data" property
        // API returns: { "data": { "id": 123, "title": "Deleted Post" } }
        // Refine needs: { "id": 123, "title": "Deleted Post" }
        return json.data;
      },
    },
    create: {
      getEndpoint: ({ resource }) => `/${resource}`,
      buildBodyParams: async ({ resource, variables }) => {
        //convert form variables according to the API
        return {
          dto: {
            ...variables,
          },
        };
      },
      mapResponse: async (response, params) => {
        const { data } = await response.json();
        return data;
      },
    },
    update: {
      getEndpoint: ({ resource, id }) => `/${resource}/${id}`,
    },
  },
  {
    hooks: {
      beforeRequest: [
        authHeaderBeforeRequestHook({})
        (request, options, {retryCount}) => {
            // Only set default auth header on initial request, not on retries
            // (retries may have refreshed token set by beforeRetry)
            if (retryCount === 0) {
                request.headers.set('Authorization', 'token initial-token');
            }
        }
    ]
  }
);

export { dataProvider };
