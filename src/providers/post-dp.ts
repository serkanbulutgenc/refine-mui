import {
  createDataProvider,
  type CreateDataProviderOptions,
  authHeaderBeforeRequestHook,
  refreshTokenAfterResponseHook,
} from '@refinedev/rest';
   
console.log("-- ",import.meta.env.VITE_BASE_API_URL)

const { dataProvider, kyInstance } = createDataProvider(
  import.meta.env.VITE_BASE_API_URL+'/api',
  {
    getList: {
      getEndpoint: ({ resource }) => resource,
      getTotalCount: async (response) => {
        const { count } = await response.json();
        return count;
      },
      mapResponse: async (response) => {
        //API returns {data:[]}
        const { results:data } = await response.json();
        return data;
      },
      //buildHeaders: {},
      buildQueryParams: async ({ pagination, sorters, filters }) => {
        const query: Record<string, any> = {};

        //Pagination
        query.page_size = pagination?.pageSize ?? 10;
        query.page = pagination?.page ?? 1;

        //Sorters and Filters

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
      getEndpoint: ({ resource }) => `${resource}/`,
      buildBodyParams: async ({ resource, variables }) => {
        //convert form variables according to the API
        //ValiidateInput and return Error if any
        return {          
            ...variables,
            categoryId:variables.category.id          
        };
      },
      mapResponse: async (response, params) => {
        const { data } = await response.json();
        return data;
      },
    },
    update: {
      getEndpoint: ({ resource, id }) => `${resource}/${id}`,
    }
  }
);


export { dataProvider };
