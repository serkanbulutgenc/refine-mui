import { type DataProvider, type HttpError } from '@refinedev/core';

const API_URL =
  'https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/api';

const fetcher = async (url: string, options?: RequestInit) => {
  const {
    meta: { session_token },
  } = JSON.parse(localStorage.getItem('auth') || '');

  return fetch(url, {
    ...options,
    headers: {
      ...options?.headers,
      //Authorization: `Bearer ${session_token}`,
      'X-Session-Token': `${session_token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const dataProvider: DataProvider = {
  getList: async ({ resource, pagination, sorters, filters, meta }) => {
    const params = new URLSearchParams();

    if (pagination) {
      params.append('page', String(pagination.currentPage));
      params.append('page_size', String(pagination.pageSize));
    }

    if (sorters && sorters.length > 0) {
      params.append('sortBy', sorters[0].field);
      params.append('order', sorters[0].order);
    }

    const res = await fetcher(`${API_URL}/${resource}?${params.toString()}`);

    if (res.status < 200 || res.status > 299) throw res;

    const data = await res.json();

    return { data: data.results, total: data.count };
  },
  getOne: async ({ resource, id, params }) => {
    const res = await fetcher(`${API_URL}/${resource}/${id}`);

    if (!res.ok) throw Error('An error occured while getting data');

    const data = await res.json();
    return { data };
  },

  create: async ({ resource, variables }) => {
    try {
      const res = await fetcher(`${API_URL}/${resource}/`, {
        method: 'POST',
        body: JSON.stringify(variables),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        return Promise.reject({
          message: res.statusText,
          statusCode: res.status,
        } as HttpError);
      }

      const data = await res.json();
      return { data };
    } catch (error) {
      const e: HttpError = {
        message: (error as any)?.message || 'Something went wrong',
        statusCode: (error as any)?.status || 500,
      };
      return Promise.reject(e);
    }
  },

  update: async ({ resource, id, variables }) => {
    /*
    const res = await fetcher(`${API_URL}/${resource}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(variables),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    return { data };
    */
    console.log(resource, id, variables);
  },
  deleteOne: async ({ resource, id, variables, meta }) => {
    try {
      const res = await fetcher(`${API_URL}/${resource}/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const error: HttpError = {
          message: res?.statusText,
          statusCode: res?.status,
        };

        return Promise.reject(error);
      }
      const data = await res.json();
      return {
        data,
      };
    } catch (e) {
      console.error(e);
      const error: HttpError = {
        message: `An error occured while getting data from server`,
        statusCode: 500,
      };
      return Promise.reject(error);
    }
  },

  //getApiUrl: () => 'https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/api',
};
