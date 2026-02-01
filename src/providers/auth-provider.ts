import { type AuthProvider, type HttpError } from '@refinedev/core';

//https://bookish-space-fortnight-6pxp5xpr7w255vv-8000.app.github.dev/_allauth/{client}/v1/auth/login
const BASE_API_URl = import.meta.env.VITE_BASE_API_URL

export const authProvider: AuthProvider = {
  check: async () => {
    const token = localStorage.getItem('access_token');

    if (token) {
      return { authenticated: true };
    }

    return { authenticated: false, logout: true, redirectTo: '/login' };
  },

  login: async ({ loginType, password }) => {
    const res = await fetch(
      `${BASE_API_URl}/_allauth/app/v1/auth/login`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: loginType,
          password,
        }),
      }
    );

    if (res.status !== 200) {
      return {
        success: false,
        error: { statusCode: res.status, message: res.statusText },
      };
    }

    const {meta:{access_token, refresh_token}} = await res.json();

    if (access_token) {
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token)
      return {
        success: true,
        redirectTo: '/',
        successNotification: {
          message: ' success',
          description: 'Successfully logged in to the app',
        },
      };
    }

    return { success: false, redirectTo: '/login' };
  },


  logout: async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token')

    return {
      success: true,
      redirectTo: '/login',
    };
  },

  onError: async (error: HttpError) => {
    if (error.status === 401) {
      console.log('error: ', JSON.stringify(error.status));

      return {
        logout: true,
        redirectTo: '/login',
        error,
      };
    }

    return {};
  },

  getIdentity: async () => {
    const token = localStorage.getItem('access_token');

    const response = await fetch(
      `${BASE_API_URl}/_allauth/app/v1/auth/session`,
      {
        headers: {
          //Authorization: `Bearer ${session_token}`,
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status < 200 || response.status > 299) {
      return null;
    }
    const {
      data: { user },
    } = await response.json();
    return {
      avatar: 'https://picsum.photos/200',
      email: user.email,
      username: user.username,
      name: user.display,
      id: user.id,
    };
  },
};
